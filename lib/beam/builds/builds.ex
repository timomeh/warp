defmodule Beam.Builds do
  @moduledoc """
  The Builds context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Builds.Build
  alias Beam.Projects.Project

  def create_build(project_id, attrs \\ %{}) do
    %Build{}
    |> Build.changeset(attrs)
    |> Ecto.Changeset.put_change(:project_id, project_id)
    |> Repo.insert()
  end

  def list_builds(project_id) do
    Repo.get!(Project, project_id) # raise if project does not exist

    from(p in Build, where: p.project_id == ^project_id)
    |> Repo.all()
    |> Repo.preload([:stages, stages: :steps])
  end

  def get_build!(id) do
    Repo.get!(Build, id)
    |> Repo.preload([:stages, stages: :steps])
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
    update_build(build, %{started_at: DateTime.utc_now()})
  end

  def set_finished(%Build{} = build) do
    update_build(build, %{finished_at: DateTime.utc_now()})
  end
end
