defmodule Warp.Worker.PipelineQueue do
  use GenServer

  require Logger

  alias Warp.Builds
  alias Warp.Pipelines
  alias Warp.Projects
  alias Warp.Worker.InitWorker

  def start(pipeline_id) do
    state = %{
      queue: [],
      pipeline_id: pipeline_id,
      debug_name: "#PipelineQueue<#{pipeline_id}>"
    }
    GenServer.start(__MODULE__, state, name: ref(pipeline_id))
  end

  def ping(pipeline_id) do
    server = GenServer.whereis(ref(pipeline_id))
    case server do
      nil -> :no
      _ -> :pong
    end
  end

  def enqueue(pipeline_id, build_id) do
    GenServer.cast(ref(pipeline_id), {:enqueue, build_id})
  end

  def dequeue(pipeline_id, build_id) do
    GenServer.cast(ref(pipeline_id), {:dequeue, build_id})
  end

  def handle_cast({:enqueue, build_id}, state) do
    log(state, "ENQUEUE [id=#{build_id}]")
    queue = state.queue ++ [build_id]
    state = Map.put(state, :queue, queue)

    if (length(queue) == 1), do: run_next_build(state)
    {:noreply, state}
  end

  def handle_cast({:dequeue, build_id}, state) do
    log(state, "DEQUEUE [id=#{build_id}]")
    queue = List.delete(state.queue, build_id)
    state = Map.put(state, :queue, queue)

    if (length(queue) > 0), do: run_next_build(state)
    {:noreply, state}
  end

  defp run_next_build(%{queue: queue, pipeline_id: pipeline_id} = state) do
    [build_id | _] = queue
    log(state, "RUN BUILD [id=#{build_id}]")

    pipeline =
      pipeline_id
      |> Pipelines.get!()

    project =
      pipeline.project_id
      |> Projects.get!()

    build =
      build_id
      |> Builds.get!()
      |> Builds.preload_stages()

    {:ok, pid} = InitWorker.start(%{
      build: build,
      git: project.git,
      pipeline_name: pipeline.human_id,
      project_id: project.id
    })
    InitWorker.run(pid)
  end

  def ref(pipeline_id) do
    {:global, {:pipeline, pipeline_id}}
  end

  defp log(%{debug_name: name} = state, text) do
    Logger.debug("#{name} #{text}")
    state
  end
end
