defmodule Beam.Repo.Migrations.ChangeLogType do
  use Ecto.Migration

  def change do
    alter table(:steps) do
      modify :log, :text
    end
  end
end
