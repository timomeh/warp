defmodule BeamWeb.API.ProjectView do
  use BeamWeb, :view

  alias BeamWeb.API.ProjectView

  def render("show.json", %{project: project}) do
    %{data: render_one(project, ProjectView, "project.json")}
  end

  def render("project.json", %{project: project}) do
    %{
      id: project.id,
      name: project.name,
      root_directory: project.root_directory
    }
  end
end
