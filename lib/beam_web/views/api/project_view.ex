defmodule BeamWeb.API.ProjectView do
  use BeamWeb, :view

  alias BeamWeb.API.BuildView
  alias BeamWeb.API.PipelineView

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
      git: project.git,
      secret: project.secret,
      pipelines: []
    }

    case project.pipelines do
      %Ecto.Association.NotLoaded{} -> output
      _ ->
        output
        |> Map.put(:pipelines, render_many(project.pipelines, PipelineView, "pipeline.json"))
    end
  end
end
