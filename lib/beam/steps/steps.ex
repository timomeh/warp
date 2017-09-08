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
    update_step(step, %{started_at: DateTime.utc_now()})
  end

  def set_finished(%Step{} = step) do
    update_step(step, %{finished_at: DateTime.utc_now()})
  end
end
