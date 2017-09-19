defmodule Beam.Builds.Build do
  @moduledoc """
  Schema for a build.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Beam.Repo
  alias Beam.Builds.Build
  alias Beam.Stages.Stage
  alias Beam.Projects.Project

  @states ~W(pending active finished errored)

  schema "builds" do
    field :type, :string
    field :state, :string, default: "pending"
    field :started_at, :utc_datetime
    field :finished_at, :utc_datetime
    belongs_to :project, Project
    has_many :stages, Stage

    timestamps()
  end

  @doc false
  def changeset(%Build{} = build, attrs \\ %{}) do
    build
    |> Repo.preload(:stages)
    |> cast(attrs, [:type, :state, :started_at, :finished_at, :project_id])
    |> assoc_constraint(:project)
    |> validate_inclusion(:state, @states)
    |> cast_assoc(:stages)
  end
end
