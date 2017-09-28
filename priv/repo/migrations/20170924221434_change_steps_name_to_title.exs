defmodule Warp.Repo.Migrations.ChangeStepsNameToTitle do
  use Ecto.Migration

  def change do
    rename table(:stages), :name, to: :title
    rename table(:steps), :name, to: :title

    alter table(:builds) do
      add :working_dir, :string
    end
  end
end
