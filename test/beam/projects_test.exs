defmodule Beam.Projects.ProjectsTest do
  use Beam.DataCase

  @valid_attrs %{
    name: "project name",
    root_directory: "/foo/bar",
    builds: [
      %{
        stages: [
          %{
            name: "Commit Stage",
            steps: [
              %{
                name: "Clone",
                command: "git clone"
              },
              %{
                name: "More",
                command: "git clone somemore"
              }
            ]
          },
          %{
            name: "Next Stage",
            execution_type: "parallel",
            steps: [
              %{
                name: "Something move",
                command: "mv foo"
              },
              %{
                name: "Something copy",
                command: "cp some thing"
              },
              %{
                name: "Something delete",
                command: "rm test.md"
              }
            ]
          }
        ]
      }
    ]
  }

  describe "projects" do
    alias Beam.Projects

    test "create_project/1 with valid data creates a project" do
      insert = Projects.create_project(@valid_attrs)
      IO.inspect insert

      true
    end
  end
end
