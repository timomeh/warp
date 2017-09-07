defmodule BeamWeb.API.ProjectView do
  use BeamWeb, :view

  alias BeamWeb.API.ProjectView
  alias BeamWeb.API.BuildView

  def render("show.json", %{project: project}) do
    %{data: render_one(project, ProjectView, "project.json")}
  end

  def render("list.json", %{projects: projects}) do
    %{data: render_many(projects, ProjectView, "project.json")}
  end

  def render("project.json", %{project: project}) do
    %{
      id: project.id,
      name: project.name,
      root_directory: project.root_directory,
      builds: render_many(project.builds, BuildView, "build.json")
    }
  end
end
