defmodule BeamWeb.API.StageView do
  use BeamWeb, :view

  alias BeamWeb.API.StepView

  def render("stage.json", %{stage: stage}) do
    %{
      name: stage.name,
      status: stage.status,
      execution_type: stage.execution_type,
      started_at: stage.started_at,
      finished_at: stage.finished_at,
      build_id: stage.build_id,
      steps: render_many(stage.steps, StepView, "step.json")
    }
  end
end
