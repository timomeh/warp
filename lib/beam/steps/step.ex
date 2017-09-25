defmodule Beam.Steps.Step do
  @moduledoc """
  Schema for a step.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Beam.Repo
  alias Beam.Steps.Step
  alias Beam.Stages.Stage

  @permitted_states ~W(pending active success failed stopped)
  @permitted_execution_types ~W(serial parallel)
  @timestamps_opts [type: :utc_datetime]

  schema "steps" do
    field :title
    field :run
    field :status, :string, default: "pending"
    field :log
    field :ordinal_rank, :integer
    field :started_at, :utc_datetime
    field :finished_at, :utc_datetime
    field :execution_type, :string, default: "run"
    has_many :substeps, __MODULE__, foreign_key: :parent_step_id
    belongs_to :parent_step, __MODULE__
    belongs_to :stage, Stage

    timestamps()
  end

  @doc false
  def changeset(%Step{} = step, attrs) do
    step
    |> Repo.preload([:stage, :substeps])
    |> cast(attrs, [:name, :run, :status, :log, :started_at, :finished_at, :stage_id, :parent_step_id, :execution_type, :ordinal_rank])
    |> validate_inclusion(:status, @permitted_states)
    |> assoc_constraint(:stage)
    |> cast_assoc(:substeps)
  end
end
