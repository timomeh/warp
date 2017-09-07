defmodule Beam.Builds.BuildsTest do
  use Beam.DataCase

  alias Beam.Builds
  alias Beam.Builds.Build
  alias Beam.Projects

  @invalid_attrs %{state: "foo"}

  def project_fixture do
    %{name: "project name", root_directory: "/foo/bar"}
    |> Projects.create_project
  end

  describe "builds" do
    test "create_build/1 with valid data creates a build" do
      {:ok, p} = project_fixture()
      assert {:ok, %Build{} = build} = Builds.create_build(p.id)
      assert build.state == "pending"
      assert build.project_id == p.id
    end

    test "create_build/1 with invalid data returns an error" do
      {:ok, p} = project_fixture()
      assert {:error, %Ecto.Changeset{}} = Builds.create_build(p.id, @invalid_attrs)
    end
  end
end
