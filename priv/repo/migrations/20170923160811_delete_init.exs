defmodule Warp.Repo.Migrations.DeleteInit do
  use Ecto.Migration

  def change do
    alter table(:pipelines) do
      remove :init_config
    end
  end
end
