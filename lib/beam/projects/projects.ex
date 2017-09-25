defmodule Beam.Projects do
  @moduledoc """
  The Projects context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Projects.Project

  def create(attrs \\ %{}) do
    %Project{}
    |> Project.changeset(attrs)
    |> Repo.insert()
  end

  def list() do
    Repo.all(Project)
    |> Repo.preload(:pipelines)
  end

  def get!(id) do
    Repo.get!(Project, id)
    |> Repo.preload(:pipelines)
  end

  def get_by!(by_clause) do
    Repo.get_by!(Project, by_clause)
    |> Repo.preload(:pipelines)
  end
end
