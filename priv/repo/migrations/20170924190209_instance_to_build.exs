defmodule Beam.Repo.Migrations.InstanceToBuild do
  use Ecto.Migration

  def change do
    rename table(:pipeline_instances), to: table(:builds)

    alter table(:builds) do
      remove :project_id
    end

    rename table(:stages), :pipeline_instance_id, to: :build_id
  end
end
