defmodule Warp.Pipeline.WorkerTest do
  use Warp.DataCase

  alias Warp.Pipeline.Worker
  alias Warp.Projects
  alias Warp.Builds

  @full_build_attrs %{
    stages: [
      %{
        name: "stage_1_name",
        steps: [
          %{name: "1_step_1_name", command: "pwd"},
          %{name: "1_step_2_name", command: "pwd"}
        ]
      },
      %{
        name: "stage_2_name",
        steps: [
          %{name: "2_step_1_name", command: "pwd"}
        ]
      }
    ]
  }

  def fixture(attrs \\ %{}) do
    {:ok, project} =
      %{name: "project name", root_directory: "/foo/bar"}
      |> Projects.create_project

    build = Builds.create_build(attrs, project.id)

    {build, project}
  end

  describe "Worker" do
    test "works" do
      {{:ok, build }, _project} = fixture(@full_build_attrs)

      step =
        build.stages
        |> Enum.at(0)
        |> Map.get(:steps)
        |> Enum.at(0)

      {pid, ref} = spawn_monitor(Worker, :start_link, [step])
      IO.inspect pid
      assert_receive {:DOWN, _ref, _type, pid, :normal}
    end
  end
end
