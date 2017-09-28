defmodule Warp.Projects.ProjectsTest do
  use Warp.DataCase

  alias Warp.Projects
  alias Warp.Projects.Project

  @valid_attrs %{name: "project name", root_directory: "/foo/bar"}
  @invalid_attrs %{foo: "bar"}

  describe "projects" do
    test "create_project/1 with valid data creates a project" do
      assert {:ok, %Project{} = project} = Projects.create_project(@valid_attrs)
      assert project.name == @valid_attrs.name
      assert project.root_directory == @valid_attrs.root_directory
    end

    test "create_project/1 with invalid data returns an error" do
      assert {:error, %Ecto.Changeset{}} = Projects.create_project(@invalid_attrs)
    end

    test "list_projects/0 returns all projects" do
      {:ok, %Project{} = project} = Projects.create_project(@valid_attrs)
      assert Projects.list_projects() == [project]
    end

    test "get_project!/1 returns the project with the given id" do
      {:ok, %Project{} = project} = Projects.create_project(@valid_attrs)
      assert Projects.get_project!(project.id) == project
    end

    test "get_project!/1 throws an error with an invalid id" do
      error = catch_error(Projects.get_project!(1337))
      assert error.__struct__ == Ecto.NoResultsError
    end
  end
end
