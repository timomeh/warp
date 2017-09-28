defmodule Warp.Pipelines do
  @moduledoc """
  The Pipelines context.
  """

  import Ecto.Query, warn: false

  alias Warp.Repo
  alias Warp.Pipelines.Pipeline

  def create(project, attrs \\ %{}) do
    fields =
      attrs
      |> Map.put(:project_id, project.id)

    %Pipeline{}
    |> Pipeline.changeset(fields)
    |> Repo.insert()
  end

  def list(project) do
    from(pipe in Pipeline, where: pipe.project_id == ^project.id)
    |> Repo.all()
  end

  def get!(id) do
    Repo.get!(Pipeline, id)
  end

  def get_by_ref!(project, ref) do
    Repo.get_by!(Pipeline, [ref: ref, project_id: project.id])
  end

  def get_by_ref_match(pipelines, ref) do
    pipelines
    |> Enum.find(fn pipeline ->
      {:ok, ref_regex} = Regex.compile(pipeline.ref_match)
      Regex.match?(ref_regex, ref)
    end)
  end
end
