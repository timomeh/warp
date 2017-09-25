defmodule Beam.Stages do
  @moduledoc """
  The Stages context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Stages.Stage

  def update(%Stage{} = stage, attrs) do
    stage
    |> Stage.changeset(attrs)
    |> Repo.update()
  end

  def get!(id) do
    Repo.get!(Stage, id)
  end

  def update_all_pending_to_stopped(build) do
    from(s in Stage, where: s.build_id == ^build.id
      and s.status == "pending")
    |> Repo.update_all(set: [status: "stopped"])
  end

  def update_started(stage) do
    stage
    |> Ecto.Changeset.change(%{started_at: DateTime.utc_now(), status: "active"})
    |> Repo.update()
  end

  def update_finished(stage, status \\ "success") do
    stage
    |> Ecto.Changeset.change(%{finished_at: DateTime.utc_now(), status: status})
    |> Repo.update()
  end
end
