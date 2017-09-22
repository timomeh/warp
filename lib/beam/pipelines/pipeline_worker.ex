defmodule Beam.Pipelines.PipelineWorker do
  use GenServer

  alias Beam.Stages
  alias Beam.Steps.StepGroupWorker
  alias Beam.Pipelines
  alias Phoenix.PubSub

  require Logger

  def start(pipeline) do
    state = %{
      pipeline: pipeline,
      current_stage_index: -1,
      debug_name: "#PipelineWorker<#{pipeline.id}>"
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

    {:ok, pipeline} = Pipelines.set_instance_started(state.pipeline)
    state = Map.put(state, :pipeline, pipeline)
    log(state, "RUN FIRST STAGE")

    state = run_next_stage(state)
    {:noreply, state}
  end

  @doc false
  def handle_info({:EXIT, _pid, :normal}, %{current_stage_index: i, pipeline: %{stages: stages}} = state)
    when i < length(stages) - 1
  do
    log(state, "RUN NEXT STAGE")
    state = run_next_stage(state)
    {:noreply, state}
  end

  @doc false
  def handle_info({:EXIT, _pid, :normal}, %{current_stage_index: i, pipeline: %{stages: stages}} = state)
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
    log(state, "TERMINATE")
    case reason do
      :normal ->
        {:ok, pipeline} = Pipelines.set_instance_finished(state.pipeline)
      :error ->
        update_pending_to_stopped(state)
        {:ok, pipeline} = Pipelines.set_instance_finished(state.pipeline, "failed")
    end
  end

  defp run_next_stage(state) do
    state = Map.put(state, :current_stage_index, state.current_stage_index + 1)

    state.pipeline.stages
    |> Enum.at(state.current_stage_index)
    |> run_stage()

    state
  end

  defp run_stage(stage) do
    {:ok, pid} = StepGroupWorker.start_link(stage, :stage)
    StepGroupWorker.run(pid)
  end

  defp update_pending_to_stopped(state) do
    Stages.stop_pending_stages_in_pipeline(state.pipeline.id)
  end

  defp broadcast(_state, pipeline, event \\ "change") do
    topic = "build:x"
    message = %{
      event: event,
      type: "pipeline",
      data: pipeline
    }
    PubSub.broadcast(Beam.PubSub, topic, message)
  end

  defp log(%{debug_name: name}, text) do
    Logger.debug("#{name} #{text}")
  end
end
