defmodule Beam.Worker.GroupWorker do
  @moduledoc """
  GenServer which executes a group of tasks.

  Terminates with :normal or :error.
  """

  use GenServer

  alias Beam.Steps
  alias Beam.Worker.TaskWorker
  alias Beam.Worker.GroupWorker
  alias Beam.Stages
  alias Phoenix.PubSub

  require Logger

  @doc false
  def start_link(group, schema) do
    state = %{
      group: group,
      execution_type: group.execution_type,
      schema: schema, # either :step or :stage
      running_worker_pids: [],
      finished_worker_pids: [],
      debug_name: "#GroupWorker<#{schema}:#{group.id}>"
    }
    Process.flag(:trap_exit, true) # Process calls terminate() before shutdown
    GenServer.start_link(__MODULE__, state)
  end

  # Client

  @doc false
  def run(pid) do
    GenServer.cast(pid, :run)
  end

  # Server callbacks

  @doc false
  def handle_cast(:run, %{execution_type: execution_type} = state) do
    state =
      state
      |> log("RUN [mode: #{execution_type}]")
      |> set_started()
      |> broadcast()
      |> run_in_type(execution_type)

    {:noreply, state}
  end

  def handle_cast(:graceful_halt, state) do
    state =
      state
      |> log("HALT requestes. notifying all children...")
      |> stop_running_workers()
      |> Map.put(:status, "stopped")

    {:stop, :normal, state}
  end

  def handle_info({:DOWN, _ref, :process, pid, :normal}, %{execution_type: type} = state)
    when type == "serial"
  do
    steps = get_steps(state)

    if length(state.finished_worker_pids) + 1 < length(steps) do
      state =
        state
        |> log("NEXT [worker finished. running next worker]")
        |> change_running_worker_to_finished(pid)
        |> run_next_step()

      {:noreply, state}
    else
      state =
        state
        |> log("DONE [worker finished. all done]")
        |> change_running_worker_to_finished(pid)

      {:stop, :normal, state}
    end
  end

  @doc false
  def handle_info({:DOWN, _ref, :process, pid, :normal}, %{execution_type: type} = state)
    when type == "parallel"
  do
    steps = get_steps(state)

    if length(state.finished_worker_pids) == length(steps) do
      state =
        state
        |> log("DONE [worker finished. all done]")
        |> change_running_worker_to_finished(pid)

      {:stop, :normal, state}
    else
      state =
        state
        |> log("WAITING [worker finished. waiting for others to finish]")

      {:noreply, state}
    end
  end

  def handle_info({:DOWN, _ref, :process, pid, :error}, state) do
    state =
      state
      |> log("ERROR FROM WORKER. starting to abort...")
      |> change_running_worker_to_finished(pid)
      |> stop_running_workers()

    {:stop, :error, state}
  end

  def handle_info({:EXIT, _pid, _reason}, state) do
    # This just means that the child worker process terminated.
    # We catch the exits in :DOWN messages.
    {:noreply, state}
  end

  @doc false
  def terminate(reason, state) do
    case reason do
      :normal ->
        status = Map.get(state, :status, "success")
        state
        |> set_finished(status)
        |> broadcast()

      :error ->
        state
        |> set_finished("failed")
        |> broadcast()
    end
  end

  defp run_in_type(state, execution_type) when execution_type == "serial" do
    run_next_step(state)
  end

  defp run_in_type(state, execution_type) when execution_type == "parallel" do
    run_all_steps(state)
  end

  defp run_next_step(state) do
    pid =
      state
      |> get_next_step()
      |> run_step()

    Map.put(state, :running_worker_pids, state.running_worker_pids ++ [pid])
  end

  defp run_all_steps(state) do
    running_worker_pids =
      state
      |> get_steps()
      |> Enum.map(&(run_step(&1)))

    Map.put(state, :running_worker_pids, running_worker_pids)
  end

  defp run_step(%{execution_type: type} = step) when type == "run" do
    {:ok, pid} = TaskWorker.start_link(step)
    TaskWorker.run(pid)
    Process.monitor(pid)
    pid
  end

  defp run_step(%{execution_type: type} = step) do
    {:ok, pid} = GroupWorker.start_link(step, :step)
    GroupWorker.run(pid)
    Process.monitor(pid)
    pid
  end

  defp get_next_step(state) do
    next_index = Enum.count(state.finished_worker_pids)
    get_steps(state)
    |> Enum.at(next_index)
  end

  defp get_steps(state) do
    steps = case state do
      %{schema: :stage} -> state.group.steps
      %{schema: :step} -> state.group.substeps
    end
  end

  defp change_running_worker_to_finished(state, pid) do
    worker_pid =
      state.running_worker_pids
      |> Enum.find(&(&1 == pid))

    state
    |> Map.put(:running_worker_pids, state.running_worker_pids -- [worker_pid])
    |> Map.put(:finished_worker_pids, state.finished_worker_pids ++ [worker_pid])
  end

  defp stop_running_workers(state) do
    state.running_worker_pids
    |> Enum.each(&(GenServer.cast(&1, :graceful_halt)))
    state
  end

  defp set_started(%{schema: schema} = state) when schema == :stage do
    {:ok, stage} = Stages.update_started(state.group)
    Map.put(state, :group, stage)
  end

  defp set_started(%{schema: schema} = state) when schema == :step do
    {:ok, step} = Steps.update_started(state.group)
    Map.put(state, :group, step)
  end

  defp set_finished(%{schema: schema} = state, status) when schema == :stage do
    {:ok, stage} = Stages.update_finished(state.group, status)
    Map.put(state, :group, stage)
  end

  defp set_finished(%{schema: schema} = state, status) when schema == :step do
    {:ok, step} = Steps.update_finished(state.group, nil, status)
    Map.put(state, :group, step)
  end

  defp broadcast(state, event \\ "change") do
    topic = "#{state.schema}:#{state.group.id}"
    message = %{
      event: event,
      type: to_string(state.schema),
      data: state.group
    }
    PubSub.broadcast(Beam.PubSub, topic, message)
    state
  end

  defp log(%{debug_name: name} = state, text) do
    Logger.debug("#{name} #{text}")
    state
  end
end
