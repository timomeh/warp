defmodule BeamWeb.API.ProjectView do
  use BeamWeb, :view

  alias BeamWeb.API.BuildView

  def render("show.json", %{project: project}) do
    %{data: render_one(project, __MODULE__, "project.json")}
  end

  def render("list.json", %{projects: projects}) do
    %{data: render_many(projects, __MODULE__, "project.json")}
  end

  def render("project.json", %{project: project}) do
    output = %{
      id: project.id,
      name: project.name,
      root_directory: project.root_directory,
      latest_builds: []
    }

    case project do
      %{builds: [_ | _]} ->
        Map.put(output, :builds, render_many(project.builds, BuildView, "build.json"))
      %{latest_builds: [_ | _]} ->
        Map.put(output, :latest_builds, render_many(project.latest_builds, BuildView, "build.json"))
      _ -> output
    end
  end
end
