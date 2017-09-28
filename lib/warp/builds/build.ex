defmodule Warp.Builds.Build do
  @moduledoc """
  Schema for an Build.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Warp.Repo
  alias Warp.Builds.Build
  alias Warp.Pipelines.Pipeline
  alias Warp.Stages.Stage

  @permitted_states ~W(queued init active success failed)
  @timestamps_opts [type: :utc_datetime]

  schema "builds" do
    field :ref
    field :commit_sha
    field :status, :string, default: "queued"
    field :working_dir
    field :started_at, :utc_datetime
    field :finished_at, :utc_datetime
    belongs_to :pipeline, Pipeline
    has_many :stages, Stage

    timestamps()
  end

  @doc false
  def changeset(%Build{} = build, attrs \\ %{}) do
    build
    |> Repo.preload(:stages)
    |> cast(attrs, [:ref, :commit_sha, :status, :started_at, :finished_at, :working_dir, :pipeline_id])
    |> assoc_constraint(:pipeline)
    |> validate_inclusion(:status, @permitted_states)
    |> cast_assoc(:stages)
  end
end
