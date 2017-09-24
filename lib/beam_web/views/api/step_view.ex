defmodule BeamWeb.API.StepView do
  use BeamWeb, :view

  def render("step.json", %{step: step}) do
    case step do
      %{execution_type: "run"} ->
        %{
          name: step.name,
          run: step.run,
          status: step.status,
          log: step.log,
          started_at: step.started_at,
          finished_at: step.finished_at,
        }
      _ ->
        %{
          execution_type: step.execution_type,
          status: step.status,
          name: step.name,
          started_at: step.started_at,
          finished_at: step.finished_at,
          steps: render_many(step.substeps, __MODULE__, "step.json")
        }
    end
  end
end
