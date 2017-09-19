defmodule Beam.Repo.Migrations.AddBuildType do
  use Ecto.Migration

  def change do
    alter table(:builds) do
      add :type, :string
    end
  end
end
