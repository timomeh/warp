defmodule Beam.Builds do
  @moduledoc """
  The Builds context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Builds.Build
  alias Beam.Steps
  alias Beam.Steps.Step
  alias Beam.Stages.Stage

  def create_queueing(pipeline, attrs \\ %{}) do
    fields =
      attrs
      |> Map.put(:started_at, DateTime.utc_now())
      |> Map.put(:status, "queueing")
      |> Map.put(:pipeline_id, pipeline.id)

    %Build{}
    |> Build.changeset(fields)
    |> Repo.insert()
  end

  def all_by_pipeline(pipeline) do
    from(i in Build, where: i.pipeline_id == ^pipeline.id)
    |> Repo.all()
  end

  def get!(id) do
    step_query = from(step in Step, order_by: step.ordinal_rank)
    stage_query = from(stage in Stage, order_by: stage.ordinal_rank, preload: [steps: ^step_query])

    build =
      Repo.get!(Build, id)
      |> Repo.preload([stages: stage_query])

    joined_and_ordered_stages =
      build.stages
      |> Enum.map(&(Map.put(&1, :steps, Steps.load_substeps(&1.steps))))

    Map.put(build, :stages, joined_and_ordered_stages)

    build
  end

  def update(build, attrs) do
    build
    |> Ecto.Changeset.change(attrs)
    |> Repo.update()
  end

  def update_started(build) do
    build
    |> Ecto.Changeset.change(%{started_at: DateTime.utc_now(), status: "active"})
    |> Repo.update()
  end

  def update_finished(build, status \\ "success") do
    build
    |> Ecto.Changeset.change(%{started_at: DateTime.utc_now(), status: status})
    |> Repo.update()
  end
end
