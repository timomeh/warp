defmodule Warp.Repo.Migrations.CommitTable do
  use Ecto.Migration

  def change do
    alter table(:builds) do
      remove :commit_sha
    end

    create table(:commits) do
      add :commit_sha, :string
      add :message, :text
      add :timestamp, :utc_datetime
      add :foreign_url, :string
      add :sender_name, :string
      add :sender_avatar, :string
      add :build_id, references(:builds)

      timestamps()
    end
  end
end
