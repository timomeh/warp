defmodule Beam.Projects do
  @moduledoc """
  The Projects context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Projects.Project


  def create_project(attrs \\ %{}) do
    %Project{}
    |> Project.changeset(attrs)
    |> Repo.insert()
  end

  def list_projects(), do: Repo.all(Project)

  def get_project!(id) do
    Repo.get!(Project, id)
    |> Repo.preload([:builds])
  end
end
