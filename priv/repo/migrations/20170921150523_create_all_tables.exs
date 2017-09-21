defmodule Beam.Repo.Migrations.CreateAllTables do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add :name, :string
      add :git, :string
      add :root_directory, :string

      timestamps()
    end

    create table(:pipelines) do
      add :name, :string
      add :ref, :string
      add :project_id, references(:projects)

      timestamps()
    end

    create table(:pipeline_instances) do
      add :name, :string
      add :ref, :string
      add :matched_ref, :string
      add :commit, :string
      add :status, :string
      add :started_at, :utc_datetime
      add :finished_at, :utc_datetime
      add :project_id, references(:projects)
      add :pipeline_id, references(:pipelines)

      timestamps()
    end

    create table(:stages) do
      add :name, :string
      add :status, :string
      add :ordinal_rank, :integer
      add :execution_type, :string
      add :started_at, :utc_datetime
      add :finished_at, :utc_datetime
      add :pipeline_instance_id, references(:pipeline_instances)

      timestamps()
    end

    create table(:steps) do
      add :name, :string
      add :status, :string
      add :run, :string
      add :log, :text
      add :ordinal_rank, :integer
      add :execution_type, :string
      add :started_at, :utc_datetime
      add :finished_at, :utc_datetime
      add :stage_id, references(:stages)
      add :parent_step_id, references(:steps)

      timestamps()
    end
  end
end
