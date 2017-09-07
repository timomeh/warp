defmodule BeamWeb.API.ProjectController do
  use BeamWeb, :controller

  alias Beam.Projects


  def index(conn, _params) do
    projects = Projects.list_projects()
    render(conn, "list.json", projects: projects)
  end

  def show(conn, %{"id" => id}) do
    project = Projects.get_project!(id)
    render(conn, "show.json", project: project)
  end

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
