defmodule Beam.Projects do
  @moduledoc """
  The Projects context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Pipelines
  alias Beam.Projects.Project

  def create_project(attrs \\ %{}) do
    %Project{}
    |> Project.changeset(attrs)
    |> Repo.insert()
  end

  def list_projects() do
    Repo.all(Project)
  end

  def get_project!(id) do
    Repo.get!(Project, id)
    |> Repo.preload(:pipelines)
  end

  def get_project_by!(by_clause) do
    Repo.get_by!(Project, by_clause)
    |> Repo.preload(:pipelines)
  end
end
