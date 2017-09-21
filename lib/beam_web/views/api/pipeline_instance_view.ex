defmodule BeamWeb.API.PipelineInstanceView do
  use BeamWeb, :view

  alias BeamWeb.API.StageView

  def render("show.json", %{pipeline_instance: pipeline_instance}) do
    %{data: render_one(pipeline_instance, __MODULE__, "pipeline_instance.json")}
  end

  def render("list.json", %{pipeline_instances: pipeline_instances}) do
    %{data: render_many(pipeline_instances, __MODULE__, "pipeline_instance.json")}
  end

  def render("pipeline_instance.json", %{pipeline_instance: pipeline_instance}) do
    output = %{
      id: pipeline_instance.id,
      name: pipeline_instance.name,
      status: pipeline_instance.status,
      ref: pipeline_instance.ref,
      matched_ref: pipeline_instance.matched_ref,
      started_at: pipeline_instance.started_at,
      finished_at: pipeline_instance.finished_at
    }

    case pipeline_instance.stages do
      %Ecto.Association.NotLoaded{} ->
        output
      _ ->
        Map.put(output, :stages, render_many(pipeline_instance.stages, StageView, "stage.json"))
    end
  end
end
