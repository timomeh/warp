defmodule Beam.Repo.Migrations.PipelineChanges do
  use Ecto.Migration

  def change do
    alter table(:pipelines) do
      add :human_id, :string
      add :init_config, :text
    end

    rename table(:pipelines), :name, to: :title
    rename table(:pipelines), :ref, to: :ref_match

    alter table(:pipeline_instances) do
      remove :name
      remove :matched_ref
    end

    alter table(:projects) do
      add :secret, :string
      remove :root_directory
    end
  end
end
