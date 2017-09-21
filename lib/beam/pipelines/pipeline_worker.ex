defmodule Beam.Pipelines.PipelineWorker do
  use GenServer

  alias Beam.Stages.StageWorker
  alias Beam.Builds
  alias Phoenix.PubSub

  require Logger

  def start(build) do
    state = %{
      build: build,
      current_stage_index: -1,
      debug_name: "#Conductor<#{build.id}>"
    }
    Process.flag(:trap_exit, true) # Process calls terminate() before shutdown
    GenServer.start(__MODULE__, state)
  end

  # Client

  def run(pid) do
    GenServer.cast(pid, :run)
  end

  # Server callbacks

  def handle_cast(:run, state) do
    log(state, "START")

    {:ok, build} = Builds.set_started(state.build)
    state = Map.put(state, :build, build)
    broadcast(state, build, "create")

    state = run_next_stage(state)
    {:noreply, state}
  end

  @doc false
  def handle_info({:EXIT, _pid, :normal}, %{current_stage_index: i, build: %{stages: stages}} = state)
    when i < length(stages) - 1
  do
    log(state, "EVENT, runner finished. run next stage")
    state = run_next_stage(state)
    {:noreply, state}
  end

  @doc false
  def handle_info({:EXIT, _pid, :normal}, %{current_stage_index: i, build: %{stages: stages}} = state)
    when i == length(stages) - 1
  do
    log(state, "EVENT, runner finished. all done")
    {:stop, :normal, state}
  end

  def handle_info({:EXIT, _pid, :error}, state) do
    log(state, "EVENT, runner FAILED. abort")
    {:stop, :error, state}
  end

  @doc false
  def handle_info(msg, state) do
    super(msg, state)
  end

  def terminate(reason, state) do
    case reason do
      :normal ->
        {:ok, build} = Builds.set_finished(state.build)
        state = Map.put(state, :build, build)
        broadcast(state, build)
      :error ->
        {:ok, build} = Builds.set_finished(state.build, "errored")
        state = Map.put(state, :build, build)
        broadcast(state, build)
    end
  end

  defp run_next_stage(state) do
    state = Map.put(state, :current_stage_index, state.current_stage_index + 1)

    state.build.stages
    |> Enum.at(state.current_stage_index)
    |> run_stage()

    state
  end

  defp run_stage(stage) do
    {:ok, pid} = Runner.start_link(stage)
    Runner.run(pid)
  end

  defp broadcast(_state, build, event \\ "change") do
    topic = "build:x"
    message = %{
      event: event,
      type: "build",
      data: build
    }
    PubSub.broadcast(Beam.PubSub, topic, message)
  end

  defp log(%{debug_name: name}, text) do
    Logger.debug("Conductor #{name} #{text}")
  end
end
