defmodule BeamWeb.API.PipelineController do
  use BeamWeb, :controller

  alias Beam.Pipelines
  alias Beam.Projects

  def show(conn, %{"id" => id}) do
    pipeline = Pipelines.get_pipeline!(id)
    render(conn, "show.json", pipeline: pipeline)
  end

  def create(conn, %{"data" => pipeline_params, "project_id" => project_id}) do
    create_pipeline =
      pipeline_params
      |> Pipelines.create_pipeline(project_id)

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
