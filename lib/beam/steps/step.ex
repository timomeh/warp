defmodule Beam.Steps.Step do
  @moduledoc """
  Schema for a step.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Beam.Repo
  alias Beam.Steps.Step
  alias Beam.Stages.Stage

  @states ~W(pending active finished errored)


  schema "steps" do
    field :name, :string
    field :command, :string
    field :state, :string, default: "pending"
    field :log, :string
    field :started_at, :utc_datetime
    field :finished_at, :utc_datetime
    belongs_to :stage, Stage

    timestamps()
  end

  @doc false
  def changeset(%Step{} = build, attrs) do
    build
    |> Repo.preload(:stage)
    |> cast(attrs, [:name, :command, :state, :log, :started_at, :finished_at, :stage_id])
    |> validate_required([:name, :command, :state])
    |> validate_inclusion(:state, @states)
    |> assoc_constraint(:stage)
  end
end
