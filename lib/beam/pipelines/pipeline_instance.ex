defmodule Beam.Pipelines.PipelineInstance do
  @moduledoc """
  Schema for a Pipeline instance.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Beam.Repo
  alias Beam.Pipelines.PipelineInstance
  alias Beam.Pipelines.Pipeline
  alias Beam.Stages.Stage
  alias Beam.Projects.Project

  @permitted_states ~W(active success failed)
  @timestamps_opts [type: :utc_datetime]

  schema "pipeline_instances" do
    field :name
    field :ref
    field :matched_ref
    field :commit
    field :status, :string, default: "active"
    field :started_at, :utc_datetime, default: DateTime.utc_now()
    field :finished_at, :utc_datetime
    belongs_to :project, Project
    belongs_to :pipeline, Pipeline
    has_many :stages, Stage

    timestamps()
  end

  @doc false
  def changeset(%PipelineInstance{} = pipeline_instance, attrs \\ %{}) do
    pipeline_instance
    |> Repo.preload(:stages)
    |> cast(attrs, [:name, :ref, :matched_ref, :commit, :status, :started_at, :finished_at, :project_id, :pipeline_id])
    |> assoc_constraint(:project)
    |> assoc_constraint(:pipeline)
    |> validate_inclusion(:status, @permitted_states)
    |> cast_assoc(:stages)
  end
end
