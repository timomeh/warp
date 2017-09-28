defmodule Warp.Commits.Commit do
  @moduledoc """
  Schema for an Build.
  """

  use Ecto.Schema

  import Ecto.Changeset

  alias Warp.Repo
  alias Warp.Builds.Build
  alias Warp.Commits.Commit

  @timestamps_opts [type: :utc_datetime]

  schema "commits" do
    field :commit_sha
    field :message
    field :timestamp, :utc_datetime
    field :foreign_url
    field :sender_name
    field :sender_avatar
    belongs_to :build, Build

    timestamps()
  end

  @doc false
  def changeset(%Commit{} = commit, attrs \\ %{}) do
    commit
    |> cast(attrs, [:commit_sha, :message, :timestamp, :foreign_url, :sender_name, :sender_avatar, :build_id])
    |> assoc_constraint(:build)
  end
end
