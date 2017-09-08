defmodule BeamWeb.API.StageView do
  use BeamWeb, :view

  alias BeamWeb.API.StepView

  def render("stage.json", %{stage: stage}) do
    %{
      name: stage.name,
      state: stage.state,
      started_at: stage.started_at,
      finished_at: stage.finished_at,
      execution_type: stage.execution_type,
      steps: render_many(stage.steps, StepView, "step.json")
    }
  end
end
