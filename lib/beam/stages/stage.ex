defmodule Beam.Stages.Stage do
  @moduledoc """
  Schema for a stage.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Beam.Repo
  alias Beam.Stages.Stage
  alias Beam.Steps.Step
  alias Beam.Builds.Build

  @states ~W(pending active finished errored)
  @execution_types ~W(series parallel)


  schema "stages" do
    field :name, :string
    field :state, :string, default: "pending"
    field :execution_type, :string, default: "series"
    field :started_at, :utc_datetime
    field :finished_at, :utc_datetime
    belongs_to :build, Build
    has_many :steps, Step

    timestamps()
  end

  @doc false
  def changeset(%Stage{} = stage, attrs) do
    stage
    |> Repo.preload(:steps)
    |> cast(attrs, [:name, :state, :execution_type, :started_at, :finished_at, :build_id])
    |> validate_required([:name, :state, :execution_type])
    |> assoc_constraint(:build)
    |> validate_inclusion(:state, @states)
    |> validate_inclusion(:execution_type, @execution_types)
    |> cast_assoc(:steps)
  end
end
