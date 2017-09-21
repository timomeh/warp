defmodule Beam.Steps do
  @moduledoc """
  The Steps context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Steps.Step

  def update_step(%Step{} = step, attrs) do
    step
    |> Step.changeset(attrs)
    |> Repo.update()
  end

  def stop_pending_steps_in_stage(stage_id) do
    from(
      s in Step,
      where: s.stage_id == ^stage_id and s.status == "pending",
      order_by: s.ordinal_rank
    )
    |> Repo.update_all(set: [state: "stopped", finished_at: DateTime.utc_now()])
  end

  def fill_substeps(steps) do
    steps
    |> Enum.map(&(get_substeps(&1)))
  end

  def get_substeps(step) do
    substeps =
      from(s in Step, where: s.parent_step_id == ^step.id)
      |> Repo.all()
      |> Enum.map(&(get_substeps(&1)))

    Map.put(step, :substeps, substeps)
  end

  def set_started(%Step{} = step) do
    update_step(step, %{started_at: DateTime.utc_now(), state: "active"})
  end

  def set_finished(%Step{} = step, log \\ nil, state \\ "finished") do
    update_step(step, %{finished_at: DateTime.utc_now(), state: state, log: log})
  end
end
