defmodule Beam.Stages do
  @moduledoc """
  The Stages context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Stages.Stage

  def update_stage(%Stage{} = stage, attrs) do
    stage
    |> Stage.changeset(attrs)
    |> Repo.update()
  end

  def stop_pending_stages_in_pipeline(pipeline_id) do
    from(
      s in Stage,
      where: s.pipeline_id == ^pipeline_id and s.status == "pending"
    )
    |> Repo.update_all(set: [state: "stopped", finished_at: DateTime.utc_now()])
  end

  def set_stage_started(%Stage{} = stage) do
    update_stage(stage, %{started_at: DateTime.utc_now(), state: "active"})
  end

  def set_stage_finished(%Stage{} = stage, state \\ "success") do
    update_stage(stage, %{finished_at: DateTime.utc_now(), state: state})
  end
end
