defmodule Beam.Builds.BuildsTest do
  use Beam.DataCase

  alias Beam.Builds
  alias Beam.Builds.Build
  alias Beam.Projects

  @invalid_attrs %{state: "foo"}
  @full_build_attrs %{
    stages: [
      %{
        name: "stage_1_name",
        steps: [
          %{name: "1_step_1_name", command: "command 1_1"},
          %{name: "1_step_2_name", command: "command 1_2"}
        ]
      },
      %{
        name: "stage_2_name",
        steps: [
          %{name: "2_step_1_name", command: "command 2_1"}
        ]
      }
    ]
  }

  def fixture(attrs \\ %{}) do
    {:ok, project} =
      %{name: "project name", root_directory: "/foo/bar"}
      |> Projects.create_project

    build = Builds.create_build(project.id, attrs)

    {build, project}
  end

  describe "builds" do
    test "create_build/1 with valid data creates a full build" do
      assert {{:ok, %Build{} = build}, project} = fixture(@full_build_attrs)
      assert build.state == "pending"
      assert build.project_id == project.id
      [stage_1, stage_2] = build.stages
      assert Enum.count(build.stages) == 2
      assert Enum.count(stage_1.steps) == 2
      assert Enum.count(stage_2.steps) == 1
    end

    test "create_build/1 with invalid data returns an error" do
      assert {{:error, %Ecto.Changeset{}}, _} = fixture(@invalid_attrs)
    end

    test "list_builds/1 returns all builds with the given project id" do
      {{:ok, %Build{} = build}, project} = fixture()
      assert Builds.list_builds(project.id) == [build]
    end

    test "get_build/1 returns the build with the given id" do
      {{:ok, %Build{} = build}, _} = fixture()
      assert Builds.get_build!(build.id) == build
    end

    test "get_build/1 throws an error with an invalid id" do
      error = catch_error(Builds.get_build!(1337))
      assert error.__struct__ == Ecto.NoResultsError
    end

    test "update_build/2 with valid data updates and returns a build" do
      {{:ok, %Build{} = build}, _} = fixture()
      assert {:ok, new_build} = Builds.update_build(build, %{state: "finished"})
      assert new_build.id == build.id
      assert new_build.state == "finished"
    end

    test "update_build/2 with invalid data returns an error" do
      {{:ok, %Build{} = build}, _} = fixture()
      assert {:error, %Ecto.Changeset{}} = Builds.update_build(build, %{state: "foobar"})
    end

    test "update_build_status/2 returns a build with updated state" do
      {{:ok, %Build{} = build}, _} = fixture()
      assert {:ok, %Build{} = new_build} = Builds.update_build_state(build, "finished")
      assert new_build.state == "finished"
    end

    test "set_started/1 returns a build with updated started_at" do
      {{:ok, %Build{} = build}, _} = fixture()
      assert {:ok, %Build{} = new_build} = Builds.set_started(build)
      assert new_build.started_at.__struct__ == DateTime
    end

    test "set_finished/1 returns a build with updated finished_at" do
      {{:ok, %Build{} = build}, _} = fixture()
      assert {:ok, %Build{} = new_build} = Builds.set_finished(build)
      assert new_build.finished_at.__struct__ == DateTime
    end
  end
end
