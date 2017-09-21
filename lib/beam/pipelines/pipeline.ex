defmodule Beam.Pipelines.Pipeline do
  @moduledoc """
  Schema for a Pipeline.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Beam.Repo
  alias Beam.Pipelines.Pipeline
  alias Beam.Pipelines.PipelineInstance
  alias Beam.Projects.Project

  @timestamps_opts [type: :utc_datetime]

  schema "pipelines" do
    field :name
    field :ref
    belongs_to :project, Project
    has_many :instances, PipelineInstance

    timestamps()
  end

  @doc false
  def changeset(%Pipeline{} = pipeline, attrs \\ %{}) do
    pipeline
    |> cast(attrs, [:name, :ref, :project_id])
    |> assoc_constraint(:project)
  end
end
