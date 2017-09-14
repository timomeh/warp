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

  def update_stage_state(%Stage{} = stage, state) do
    update_stage(stage, %{state: state})
  end

  def set_started(%Stage{} = stage) do
    update_stage(stage, %{started_at: DateTime.utc_now(), state: "active"})
  end

  def set_finished(%Stage{} = stage, state \\ "finished") do
    update_stage(stage, %{finished_at: DateTime.utc_now(), state: state})
  end
end
