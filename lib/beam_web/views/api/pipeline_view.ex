defmodule BeamWeb.API.PipelineView do
  use BeamWeb, :view

  alias BeamWeb.API.StageView

  def render("show.json", %{pipeline: pipeline}) do
    %{data: render_one(pipeline, __MODULE__, "pipeline.json")}
  end

  def render("list.json", %{pipelines: pipelines}) do
    %{data: render_many(pipelines, __MODULE__, "pipeline.json")}
  end

  def render("pipeline.json", %{pipeline: pipeline}) do
    output = %{
      id: pipeline.id,
      name: pipeline.name,
      ref: pipeline.ref,
      inserted_at: pipeline.inserted_at
    }
  end
end
