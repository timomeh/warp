defmodule Beam.Projects.Project do
  @moduledoc """
  Schema for a project.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Beam.Projects.Project
  alias Beam.Pipelines.Pipeline

  @timestamps_opts [type: :utc_datetime]

  schema "projects" do
    field :name, :string
    field :root_directory, :string
    field :git, :string
    has_many :pipelines, Pipeline

    timestamps()
  end

  @doc false
  def changeset(%Project{} = project, attrs) do
    project
    |> cast(attrs, [:name, :root_directory])
    |> validate_required([:name, :root_directory])
  end
end
