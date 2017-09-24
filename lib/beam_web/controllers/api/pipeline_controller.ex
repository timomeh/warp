defmodule BeamWeb.API.PipelineController do
  use BeamWeb, :controller

  alias Beam.Pipelines
  alias Beam.Projects

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
    create_pipeline =
      project_id
      |> Projects.get!()
      |> Pipelines.create(pipeline_params)

    case create_pipeline do
      {:ok, pipeline} ->
        conn
        |> put_status(:created)
        |> render("show.json", pipeline: pipeline)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(BeamWeb.API.ChangesetView, "error.json", changeset: changeset)
    end
  end
end
