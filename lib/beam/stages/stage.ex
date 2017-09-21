defmodule Beam.Stages.Stage do
  @moduledoc """
  Schema for a stage.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Beam.Repo
  alias Beam.Stages.Stage
  alias Beam.Steps.Step
  alias Beam.Pipelines.PipelineInstance

  @permitted_states ~W(pending active success failed stopped)
  @permitted_execution_types ~W(serial parallel)
  @timestamps_opts [type: :utc_datetime]

  schema "stages" do
    field :name, :string
    field :status, :string, default: "pending"
    field :ordinal_rank, :integer
    field :execution_type
    field :started_at, :utc_datetime
    field :finished_at, :utc_datetime
    belongs_to :pipeline_instance, PipelineInstance
    has_many :steps, Step

    timestamps()
  end

  @doc false
  def changeset(%Stage{} = stage, attrs) do
    stage
    |> Repo.preload(:steps)
    |> cast(attrs, [:name, :status, :started_at, :finished_at, :pipeline_instance_id, :ordinal_rank, :execution_type])
    |> validate_required([:name, :status, :ordinal_rank])
    |> validate_inclusion(:status, @permitted_states)
    |> assoc_constraint(:pipeline_instance)
    |> cast_assoc(:steps)
  end
end
