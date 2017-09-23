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
    field :git, :string
    field :secret
    has_many :pipelines, Pipeline

    timestamps()
  end

  @doc false
  def changeset(%Project{} = project, attrs) do
    project
    |> cast(attrs, [:name, :git, :secret])
    |> validate_required([:name, :git, :secret])
    |> cast_assoc(:pipelines)
  end
end
