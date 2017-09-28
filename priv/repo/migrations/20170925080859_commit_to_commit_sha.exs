defmodule Warp.Repo.Migrations.CommitToCommitSha do
  use Ecto.Migration

  def change do
    rename table(:builds), :commit, to: :commit_sha
  end
end
