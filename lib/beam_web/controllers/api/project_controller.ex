defmodule BeamWeb.API.ProjectController do
  use BeamWeb, :controller

  alias Beam.Projects

  def create(conn, %{"data" => project_params}) do
    case Projects.create_project(project_params) do
      {:ok, project} ->
        conn
        |> put_status(:created)
        |> render("show.json", project: project)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(BeamWeb.API.ChangesetView, "error.json", changeset: changeset)
    end
  end
end
