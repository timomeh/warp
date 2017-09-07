defmodule Beam.Projects.Project do
  use Ecto.Schema
  import Ecto.Changeset
  alias Beam.Projects.Project


  schema "projects" do
    field :name, :string
    field :root_directory, :string

    timestamps()
  end

  @doc false
  def changeset(%Project{} = project, attrs) do
    project
    |> cast(attrs, [:name, :root_directory])
    |> validate_required([:name, :root_directory])
  end
end
