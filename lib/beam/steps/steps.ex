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

  def update_step_state(%Step{} = step, state) do
    update_step(step, %{state: state})
  end

  def set_started(%Step{} = step) do
    update_step(step, %{started_at: DateTime.utc_now(), state: "active"})
  end

  def set_finished(%Step{} = step, log \\ nil, state \\ "finished") do
    update_step(step, %{finished_at: DateTime.utc_now(), state: state, log: log})
  end
end
