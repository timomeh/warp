defmodule Beam.Worker.BuildWorker do
  use GenServer

  alias Beam.Stages
  alias Beam.Worker.GroupWorker
  alias Beam.Builds
  alias Phoenix.PubSub

  require Logger

  def start(build, project_id) do
    state = %{
      build: build,
      current_stage_index: -1,
      project_id: project_id,
      debug_name: "#BuildWorker<#{build.id}>"
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

    {:ok, build} = Builds.update_started(state.build)
    state =
      state
      |> Map.put(:build, build)
      |> broadcast()
      |> log("RUN FIRST STAGE")
      |> run_next_stage()

    {:noreply, state}
  end

  @doc false
  def handle_info({:EXIT, _pid, :normal}, %{current_stage_index: i, build: %{stages: stages}} = state)
    when i < length(stages) - 1
  do
    state =
      state
      |> log("RUN NEXT STAGE")
      |> run_next_stage()

    {:noreply, state}
  end

  @doc false
  def handle_info({:EXIT, _pid, :normal}, %{current_stage_index: i, build: %{stages: stages}} = state)
    when i == length(stages) - 1
  do
    log(state, "ALL STAGES DONE")
    {:stop, :normal, state}
  end

  @doc false
  def handle_info({:EXIT, _pid, :error}, state) do
    log(state, "STAGE ERRORED. ABORT")
    {:stop, :error, state}
  end

  @doc false
  def handle_info(msg, state) do
    super(msg, state)
  end

  def terminate(reason, state) do
    build = case reason do
      :normal ->
        {:ok, build} = Builds.update_finished(state.build)
        build
      :error ->
        {:ok, build} = Builds.update_finished(state.build, "failed")
        Stages.update_all_pending_to_stopped(build)
        build
    end

    state
    |> Map.put(:build, build)
    |> log("TERMINATE")
    |> broadcast()
  end

  defp run_next_stage(state) do
    state = Map.put(state, :current_stage_index, state.current_stage_index + 1)

    state.build.stages
    |> Enum.at(state.current_stage_index)
    |> run_stage(state)

    state
  end

  defp run_stage(stage, state) do
    {:ok, pid} = GroupWorker.start_link(stage, state.project_id, :stage)
    GroupWorker.run(pid)
  end

  defp broadcast(state, event \\ "change") do
    topic = "project:#{state.project_id}"
    message = %{
      event: event,
      type: "build",
      data: state.build
    }
    PubSub.broadcast(Beam.PubSub, topic, message)
    state
  end

  defp log(%{debug_name: name} = state, text) do
    Logger.debug("#{name} #{text}")
    state
  end
end
