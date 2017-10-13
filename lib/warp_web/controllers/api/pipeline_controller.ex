defmodule WarpWeb.API.PipelineController do
  use WarpWeb, :controller

  alias Warp.Pipelines
  alias Warp.Projects

  def index(conn, %{"project_id" => project_id}) do
    project = Projects.get!(project_id)
    pipelines = Pipelines.list(project)
    render(conn, "list.json", pipelines: pipelines)
  end

  def show(conn, %{"id" => id}) do
    pipeline = Pipelines.get!(id)
    render(conn, "show.json", pipeline: pipeline)
  end

  def create(conn, %{"data" => pipeline_params, "project_id" => project_id}) do
    project = Projects.get!(project_id)

    case Pipelines.create(project, pipeline_params) do
      {:ok, pipeline} ->
        conn
        |> put_status(:created)
        |> render("show.json", pipeline: pipeline)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(WarpWeb.API.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "data" => pipeline_params}) do
    pipeline = Pipelines.get!(id)

    case Pipelines.update(pipeline, pipeline_params) do
      {:ok, pipeline} ->
        render(conn, "show.json", pipeline: pipeline)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(WarpWeb.API.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    pipeline = Pipelines.get!(id)
    {:ok, _pipeline} = Pipelines.delete(pipeline)
    render(conn, WarpWeb.API.MetaView, "show.json", message: "Pipeline deleted successfully.")
  end
end
