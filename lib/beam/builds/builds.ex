defmodule Beam.Builds do
  @moduledoc """
  The Builds context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Builds.Build
  alias Beam.Steps.Step
  alias Beam.Projects.Project

  def create_build(attrs, project_id) do
    %Build{}
    |> Build.changeset(attrs)
    |> Ecto.Changeset.merge(Build.changeset(%Build{}, %{project_id: project_id}))
    |> Repo.insert()
  end

  def list_builds(project_id) do
    Repo.get!(Project, project_id) # raise if project does not exist

    from(b in Build, where: b.project_id == ^project_id)
    |> Repo.all()
    |> Repo.preload([:stages, stages: :steps])
  end

  def list_distinct_builds(project_id) do
    from(
      b in Build,
      where: b.project_id == ^project_id,
      distinct: b.type,
      order_by: [desc: b.started_at] # latest distinct record
    )
    |> Repo.all()
    |> Enum.sort(&(DateTime.compare(&1.started_at, &2.started_at) == :gt)) # sort from latest
  end

  def get_build!(id) do
    Repo.get!(Build, id)
    |> Repo.preload([:stages, stages: [steps: from(s in Step, order_by: s.id)]])
  end

  def update_build(%Build{} = build, attrs) do
    build
    |> Build.changeset(attrs)
    |> Repo.update()
  end

  def update_build_state(%Build{} = build, state) do
    update_build(build, %{state: state})
  end

  def set_started(%Build{} = build) do
    update_build(build, %{started_at: DateTime.utc_now(), state: "active"})
  end

  def set_finished(%Build{} = build, state \\ "finished") do
    update_build(build, %{finished_at: DateTime.utc_now(), state: state})
  end
end
