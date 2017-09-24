defmodule BeamWeb.API.ProjectController do
  use BeamWeb, :controller

  alias Beam.Projects

  def index(conn, _params) do
    projects = Projects.list()
    render(conn, "list.json", projects: projects)
  end

  def show(conn, %{"id" => id}) do
    project = Projects.get!(id)
    render(conn, "show.json", project: project)
  end

  def create(conn, %{"data" => project_params}) do
    create_project =
      project_params
      |> Map.put("secret", generate_secret(32))
      |> Projects.create()

    case create_project do
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

  defp generate_secret(length) do
    :crypto.strong_rand_bytes(length)
    |> Base.url_encode64()
    |> binary_part(0, length)
  end
end
