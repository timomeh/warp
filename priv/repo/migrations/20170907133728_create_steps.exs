defmodule Beam.Repo.Migrations.CreateSteps do
  use Ecto.Migration

  def change do
    create table(:steps) do
      add :name, :string
      add :command, :string
      add :state, :string
      add :log, :string
      add :started_at, :utc_datetime
      add :finished_at, :utc_datetime
      add :stage_id, references(:stages)

      timestamps()
    end
  end
end
