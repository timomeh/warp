defmodule Beam.Pipeline.Runner do
  @moduledoc """
  GenServer which executes one stage of a pipeline. Calls each step, either in
  series or in parallel.
  Stage needs to be preloaded with steps.

  Terminates with :ok or :failed.

  ## Example

    iex> {:ok, pid} = Runner.start_link(stage)
    iex> Runner.run(pid)
    {:ok, %{} = state}

  """

  use GenServer

  alias Beam.Pipeline.Worker
  alias Beam.Steps
  alias Beam.Stages

  require Logger

  @doc false
  def start_link(stage) do
    state = %{
      stage: stage,
      type: stage.execution_type,
      running_tasks: [],
      finished_tasks: [],
      debug_name: "#Runner<#{stage.id}>"
    }
    Process.flag(:trap_exit, true) # Process calls terminate() before shutdown
    GenServer.start_link(__MODULE__, state)
  end

  # Client

  @doc false
  def run(pid) do
    GenServer.call(pid, :run)
  end

  # Server callbacks

  @doc false
  def handle_call(:run, _from, %{type: type} = state)
      when type == "series"
  do
    log(state, "START, in series mode")
    Stages.set_started(state.stage)
    state = run_next_step(state)
    {:reply, state, state}
  end

  @doc false
  def handle_call(:run, _from, %{type: type} = state)
      when type == "parallel"
  do
    log(state, "START, in parallel mode")
    Stages.set_started(state.stage)
    state = run_all_steps(state)
    {:reply, state, state}
  end

  @doc false
  def handle_info({ref, :error}, state) do
    log(state, "EVENT, worker ERRORED. abort")
    state =
      state
      |> deregister_task_in_state(ref)

    {:stop, :failed, state}
  end

  @doc false
  def handle_info({ref, :ok}, %{type: type, finished_tasks: finished_tasks, stage: %{steps: steps}} = state)
      when type == "series"
      and length(finished_tasks) + 1 < length(steps)
  do
    log(state, "EVENT, worker finished. run next step")
    state =
      state
      |> deregister_task_in_state(ref)
      |> run_next_step()

    {:noreply, state}
  end

  @doc false
  def handle_info({ref, :ok}, %{type: type, finished_tasks: finished_tasks, stage: %{steps: steps}} = state)
      when type == "series"
      and length(finished_tasks) + 1 == length(steps)
  do
    log(state, "EVENT, worker finished. all done")
    state = deregister_task_in_state(state, ref)
    {:stop, :ok, state}
  end

  @doc false
  def handle_info({ref, :ok}, %{type: type} = state)
      when type == "parallel"
  do
    state = deregister_task_in_state(state, ref)

    if length(state.finished_tasks) == length(state.stage.steps) do
      log(state, "EVENT, worker finished. all done")
      {:stop, :ok, state}
    else
      log(state, "EVENT, worker finished. waiting for other workers to finish")
      {:noreply, state}
    end
  end

  @doc false
  def handle_info({:DOWN, _ref, :process, _pid, :normal}, state) do
    # This just means that the worker died, either good or bad.
    # Will be catched in handle_info({ref, :ok | :error}).
    # So no reason to execute something here.
    {:noreply, state}
  end

  @doc false
  def handle_info(msg, state) do
    super(msg, state)
  end

  @doc false
  def terminate(reason, state) do
    stop_running_tasks(state.running_tasks)
    case reason do
      :ok -> Stages.set_finished(state.stage)
      :failed ->
        Stages.set_finished(state.stage, "errored")
        Steps.stop_active_steps_in_stage(state.stage.id)
    end
  end

  defp run_next_step(state) do
    state
    |> get_next_step()
    |> run_task()
    |> register_task_in_state(state)
  end

  defp run_all_steps(state) do
    running_tasks = Enum.map(state.stage.steps, fn step -> run_task(step) end)
    Map.put(state, :running_tasks, running_tasks)
  end

  defp get_next_step(state) do
    index = Enum.count(state.running_tasks)
    Enum.at(state.stage.steps, index)
  end

  defp run_task(step) do
    Task.async(fn -> Worker.run(step) end)
  end

  defp stop_running_tasks(running_tasks) do
    Enum.each(running_tasks, fn task -> Task.shutdown(task) end)
  end

  defp register_task_in_state(%Task{} = task, state) do
    Map.put(state, :running_tasks, state.running_tasks ++ [task])
  end

  defp deregister_task_in_state(state, ref) do
    task = Enum.find(state.running_tasks, fn task ->
      task.ref == ref
    end)

    state
    |> Map.put(:running_tasks, state.running_tasks -- [task])
    |> Map.put(:finished_tasks, state.finished_tasks ++ [task])
  end

  defp log(%{debug_name: name}, text) do
    Logger.debug("Runner #{name} #{text}")
  end
end
