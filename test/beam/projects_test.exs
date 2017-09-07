defmodule Beam.Projects.ProjectsTest do
  use Beam.DataCase

  @valid_attrs %{name: "project name", root_directory: "/foo/bar"}
  @invalid_attrs %{name: 1}

  describe "projects" do
    alias Beam.Projects

    test "create_project/1 with valid data creates a project" do
      assert {:ok, project} = Projects.create_project(@valid_attrs)
      assert project.name == @valid_attrs.name
      assert project.root_directory == @valid_attrs.root_directory
    end

    test "create_project/1 with invalid data returns an error" do
      assert {:error, _changeset} = Projects.create_project(@invalid_attrs)
    end
  end
end
