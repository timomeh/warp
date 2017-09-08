defmodule BeamWeb.API.StepView do
  use BeamWeb, :view

  def render("step.json", %{step: step}) do
    %{
      command: step.command,
      state: step.state,
      started_at: step.started_at,
      finished_at: step.finished_at
    }
  end
end
