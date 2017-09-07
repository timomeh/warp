defmodule Beam.Repo.Migrations.CreateProjects do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add :name, :string
      add :root_directory, :string

      timestamps()
    end
  end
end
