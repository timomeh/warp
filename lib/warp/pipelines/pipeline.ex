defmodule Warp.Pipelines.Pipeline do
  @moduledoc """
  Schema for a Pipeline.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Warp.Pipelines.Pipeline
  alias Warp.Builds.Build
  alias Warp.Projects.Project

  @timestamps_opts [type: :utc_datetime]

  schema "pipelines" do
    field :title
    field :ref_match
    field :human_id
    belongs_to :project, Project
    has_many :builds, Build

    timestamps()
  end

  @doc false
  def changeset(%Pipeline{} = pipeline, attrs \\ %{}) do
    pipeline
    |> cast(attrs, [:title, :ref_match, :human_id, :project_id])
    |> assoc_constraint(:project)
  end
end
