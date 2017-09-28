defmodule Warp.Steps do
  @moduledoc """
  The Steps context.
  """

  import Ecto.Query, warn: false

  alias Warp.Repo
  alias Warp.Steps.Step

  def get!(id) do
    Repo.get!(Step, id)
  end

  def update(%Step{} = step, attrs) do
    step
    |> Step.changeset(attrs)
    |> Repo.update()
  end

  def update_all_pending_to_stopped(stage) do
    from(s in Step, where: s.stage_id == ^stage.id
      and s.status == "pending",
      order_by: s.ordinal_rank)
    |> Repo.update_all(set: [status: "stopped"])
  end

  def load_substeps(steps) do
    steps
    |> Enum.map(fn step ->
      substeps =
        from(
          s in Step,
          where: s.parent_step_id == ^step.id,
          order_by: [asc: s.ordinal_rank]
        )
        |> Repo.all()
        |> load_substeps()

      Map.put(step, :substeps, substeps)
    end)
  end

  def update_started(step) do
    step
    |> Ecto.Changeset.change(%{started_at: DateTime.utc_now(), status: "active"})
    |> Repo.update()
  end

  def update_finished(step, log \\ nil, status \\ "success") do
    step
    |> Ecto.Changeset.change(%{finished_at: DateTime.utc_now(), log: log, status: status})
    |> Repo.update()
  end
end
