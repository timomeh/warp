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
  end

  def get_build!(id) do
    Repo.get!(Build, id)
    |> Repo.preload([:stages, stages: :steps])
  end
end
