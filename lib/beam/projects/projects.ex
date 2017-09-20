defmodule Beam.Projects do
  @moduledoc """
  The Projects context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Builds
  alias Beam.Projects.Project

  def create_project(attrs \\ %{}) do
    %Project{}
    |> Project.changeset(attrs)
    |> Repo.insert()
  end

  def list_projects() do
    Repo.all(Project)
  end

  def list_projects_latest_builds() do
    list_projects
    |> Enum.map(fn project ->
        Map.put(project, :latest_builds, Builds.list_distinct_builds(project.id))
      end)
    |> Enum.sort(fn (p1, p2) ->
      Enum.at(p1.latest_builds, 0).started_at >= Enum.at(p2.latest_builds, 0).started_at
    end)
  end

  def get_project!(id) do
    Repo.get!(Project, id)
  end

  def get_project_with_latest_builds!(id) do
    project = Repo.get!(Project, id)
    Map.put(project, :latest_builds, Builds.list_distinct_builds(project.id))
  end
end
