defmodule Beam.Repo.Migrations.CreateBuilds do
  use Ecto.Migration

  def change do
    create table(:builds) do
      add :state, :string
      add :started_at, :utc_datetime
      add :finished_at, :utc_datetime
      add :project_id, references(:projects)

      timestamps()
    end
  end
end
