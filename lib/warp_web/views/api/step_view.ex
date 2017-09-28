defmodule WarpWeb.API.StepView do
  use WarpWeb, :view

  def render("step.json", %{step: step}) do
    case step do
      %{execution_type: "run"} ->
        %{
          id: step.id,
          title: step.title,
          run: step.run,
          status: step.status,
          log: step.log,
          started_at: step.started_at,
          finished_at: step.finished_at,
          parent_step_id: step.parent_step_id
        }
      _ ->
        %{
          id: step.id,
          execution_type: step.execution_type,
          status: step.status,
          title: step.title,
          started_at: step.started_at,
          finished_at: step.finished_at,
          parent_step_id: step.parent_step_id,
          steps: render_many(step.substeps, __MODULE__, "step.json")
        }
    end
  end
end
