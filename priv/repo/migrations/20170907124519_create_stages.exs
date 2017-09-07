defmodule Beam.Repo.Migrations.CreateStages do
  use Ecto.Migration

  def change do
    create table(:stages) do
      add :name, :string
      add :state, :string
      add :execution_type, :string
      add :started_at, :utc_datetime
      add :finished_at, :utc_datetime
      add :build_id, references(:builds)

      timestamps()
    end
  end
end
