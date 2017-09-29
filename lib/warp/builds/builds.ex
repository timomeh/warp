defmodule Warp.Builds do
  @moduledoc """
  The Builds context.
  """

  import Ecto.Query, warn: false

  alias Warp.Repo
  alias Warp.Pipelines.Pipeline
  alias Warp.Builds.Build
  alias Warp.Steps
  alias Warp.Steps.Step
  alias Warp.Stages.Stage

  def create_queueing(pipeline, attrs \\ %{}) do
    fields =
      attrs
      |> Map.put(:status, "queued")
      |> Map.put(:pipeline_id, pipeline.id)

    %Build{}
    |> Build.changeset(fields)
    |> Repo.insert()
  end

  def all_by_pipeline(pipeline) do
    from(b in Build, where: b.pipeline_id == ^pipeline.id, preload: [:commit])
    |> Repo.all()
  end

  def all_by_project(project, offset \\ 0, limit \\ 25) do
    from(
      b in Build,
      join: p in Pipeline,
      where: p.project_id == ^project.id
        and b.pipeline_id == p.id
        and b.status in ["success", "failed"],
      order_by: [desc: b.finished_at],
      limit: ^limit,
      offset: ^offset,
      preload: [:commit]
    )
    |> Repo.all()
  end

  def all_distinct_latest_by_pipeline(pipeline) do
    from(
      b in Build,
      where: b.pipeline_id == ^pipeline.id
        and b.status != "queued",
      order_by: [desc: b.started_at],
      distinct: b.pipeline_id,
      preload: [:commit]
    )
    |> Repo.all()
  end

  def get!(id) do
    Repo.get!(Build, id)
    |> Repo.preload(:commit)
  end

  def update(build, attrs) do
    build
    |> Ecto.Changeset.change(attrs)
    |> Repo.update()
  end

  def update_initializing(build) do
    build
    |> Ecto.Changeset.change(%{started_at: DateTime.utc_now(), status: "init"})
    |> Repo.update()
  end

  def update_started(build) do
    build
    |> Ecto.Changeset.change(%{status: "active"})
    |> Repo.update()
  end

  def update_finished(build, status \\ "success") do
    build
    |> Ecto.Changeset.change(%{finished_at: DateTime.utc_now(), status: status})
    |> Repo.update()
  end

  def preload_stages(build) do
    step_query = from(step in Step, order_by: [asc: step.ordinal_rank])
    stage_query = from(stage in Stage, order_by: [asc: stage.ordinal_rank], preload: [steps: ^step_query])

    build =
      build
      |> Repo.preload([:commit, stages: stage_query])

    joined_and_ordered_stages =
      build.stages
      |> Enum.map(&(Map.put(&1, :steps, Steps.load_substeps(&1.steps))))

    Map.put(build, :stages, joined_and_ordered_stages)
  end
end
