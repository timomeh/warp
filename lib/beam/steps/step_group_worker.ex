defmodule Beam.Steps.StepGroupWorker do
  @moduledoc """
  GenServer which executes one stage of a pipeline.

  Terminates with :normal or :error.
  """

  use GenServer

  alias Beam.Steps
  alias Beam.Steps.StepWorker
  alias Beam.Steps.StepGroupWorker
  alias Beam.Stages
  alias Phoenix.PubSub

  require Logger

  @doc false
  def start_link(group, schema) do
    state = %{
      group: group,
      execution_type: group.execution_type,
      schema: schema, # either :step or :stage
      running_steps: [],
      finished_steps: [],
      debug_name: "#StepGroupWorker<#{group.id}.#{schema}>"
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
  def handle_cast(:run, %{execution_type: execution_type} = state) when execution_type == "serial" do
    log(state, "RUN in serial mode")
    state =
      state
      |> set_started()
      |> run_next_step()

    {:noreply, state}
  end

  @doc false
  def handle_cast(:run, %{execution_type: type} = state) when type == "parallel" do
    log(state, "RUN in parallel mode")
    state =
      state
      |> set_started()
      |> run_all_steps()

    {:noreply, state}
  end

  def handle_cast(:graceful_halt, state) do
    log(state, "HALT requested. halting all children...")
    stop_running_steps(state.running_steps)
    state = Map.put(:status, "stopped")
    {:stop, :normal, state}
  end

  def handle_info({:DOWN, _ref, :process, pid, :normal}, %{execution_type: type, finished_steps: finished_steps} = state)
    when type == "serial"
  do
    log(state, "CHILD finished. running next child")
    steps = get_steps(state)

    if length(finished_steps) + 1 < length(steps) do
      state =
        state
        |> deregister_step_in_state(pid)
        |> run_next_step()

      {:noreply, state}
    else
      state = deregister_step_in_state(state, pid)
      {:stop, :normal, state}
    end

  end

  @doc false
  def handle_info({:DOWN, _ref, :process, pid, :normal}, %{execution_type: type} = state)
    when type == "parallel"
  do
    state = deregister_step_in_state(state, pid)
    steps = get_steps(state)

    if length(state.finished_steps) == length(steps) do
      log(state, "CHILD finished. all done")
      {:stop, :normal, state}
    else
      log(state, "CHILD finished. waiting for other children to finish")
      {:noreply, state}
    end
  end

  def handle_info({:DOWN, _ref, :process, pid, :error}, state) do
    log(state, "CHILD ERRORED. abort")
    stop_running_steps(state.running_steps)
    state = deregister_step_in_state(state, pid)

    {:stop, :error, state}
  end

  def handle_info({:EXIT, _pid, _reason}, state) do
    # This just means that the child process terminated.
    {:noreply, state}
  end

  @doc false
  def terminate(reason, state) do
    case reason do
      :normal ->
        status = Map.get(state, :status, "success")
        state = set_finished(state, status)
        # broadcast(state, stage)
      :error ->
        state = set_finished(state, "failed")
        # broadcast(state, stage)
        # Steps.stop_active_steps_in_stage(state.stage.id)
    end
  end

  defp run_next_step(state) do
    next_step = get_next_step(state)
    pid = run_step(next_step)

    Map.put(state, :running_steps, state.running_steps ++ [pid])
  end

  defp get_next_step(state) do
    index = Enum.count(state.finished_steps)
    get_steps(state)
    |> Enum.at(index)
  end

  defp get_steps(state) do
    steps = case state do
      %{schema: :stage} -> state.group.steps
      %{schema: :step} -> state.group.substeps
    end
  end

  defp run_all_steps(state) do
    running_steps =
      state
      |> get_steps()
      |> Enum.map(&(run_step(&1)))

    Map.put(state, :running_steps, running_steps)
  end

  defp run_step(%{execution_type: type} = step) when type == "run" do
    {:ok, pid} = StepWorker.start_link(step)
    StepWorker.run(pid)
    Process.monitor(pid)
    pid
  end

  defp run_step(%{execution_type: type} = step) do
    {:ok, pid} = StepGroupWorker.start_link(step, :step)
    StepGroupWorker.run(pid)
    Process.monitor(pid)
    pid
  end

  defp deregister_step_in_state(state, pid) do
    step_pid = Enum.find(state.running_steps, fn step_pid ->
      step_pid == pid
    end)

    state
    |> Map.put(:running_steps, state.running_steps -- [step_pid])
    |> Map.put(:finished_steps, state.finished_steps ++ [step_pid])
  end

  defp stop_running_steps(running_steps) do
    Enum.each(running_steps, fn step_pid -> GenServer.cast(step_pid, :graceful_halt) end)
  end

  defp set_started(%{schema: schema} = state) when schema == :stage do
    {:ok, stage} = Stages.set_stage_started(state.group)
    Map.put(state, :group, stage)
  end

  defp set_started(%{schema: schema} = state) when schema == :step do
    {:ok, step} = Steps.set_step_started(state.group)
    Map.put(state, :group, step)
  end

  defp set_finished(%{schema: schema} = state, status) when schema == :stage do
    {:ok, stage} = Stages.set_stage_finished(state.group, status)
    Map.put(state, :group, stage)
  end

  defp set_finished(%{schema: schema} = state, status) when schema == :step do
    {:ok, step} = Steps.set_step_finished(state.group, nil, status)
    Map.put(state, :group, step)
  end

  defp log(%{debug_name: name}, text) do
    Logger.debug("#{name} #{text}")
  end
end
