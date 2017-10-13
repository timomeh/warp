defmodule Warp.Pipelines do
  @moduledoc """
  The Pipelines context.
  """

  import Ecto.Query, warn: false

  alias Warp.Repo
  alias Warp.Pipelines.Pipeline
  alias Warp.Builds.Build

  def create(project, attrs \\ %{}) do
    fields =
      attrs
      |> Map.put("project_id", project.id)

    %Pipeline{}
    |> Pipeline.changeset(fields)
    |> Repo.insert()
  end

  def list(project) do
    from(pipe in Pipeline, where: pipe.project_id == ^project.id)
    |> Repo.all()
    |> Enum.map(&(populate_mean_duration(&1)))
  end

  def get!(id) do
    Repo.get!(Pipeline, id)
    |> populate_mean_duration()
  end

  def update(%Pipeline{} = pipeline, attrs) do
    pipeline
    |> Pipeline.changeset(attrs)
    |> Repo.update()
  end

  def delete(%Pipeline{} = pipeline) do
    Repo.delete(pipeline)
  end

  def get_by_ref!(project, ref) do
    Repo.get_by!(Pipeline, [ref: ref, project_id: project.id])
    |> populate_mean_duration()
  end

  def get_by_ref_match(pipelines, ref) do
    pipelines
    |> Enum.find(fn pipeline ->
      {:ok, ref_regex} = Regex.compile(pipeline.ref_match)
      Regex.match?(ref_regex, ref)
    end)
    |> populate_mean_duration()
  end

  def populate_mean_duration(pipeline) do
    {durations, durations_sum} =
      from(
        build in Build,
        where: build.pipeline_id == ^pipeline.id
          and build.status == "success",
        select: %{started_at: build.started_at, finished_at: build.finished_at},
        order_by: [desc: build.finished_at],
        limit: 5
      )
      |> Repo.all()
      |> Enum.map_reduce(0, fn (build, acc) ->
        diff = DateTime.diff(build.finished_at, build.started_at)
        {diff, diff + acc}
      end)

    mean_duration =
      case length(durations) do
        0 -> 0
        _ -> durations_sum/length(durations)
      end

    Map.put(pipeline, :mean_duration, mean_duration)
  end
end
