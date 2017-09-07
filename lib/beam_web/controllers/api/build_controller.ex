defmodule BeamWeb.API.BuildController do
  use BeamWeb, :controller

  alias Beam.Builds

  def index(conn, %{"project_id" => project_id}) do
    builds = Builds.list_builds(project_id)
    render(conn, "list.json", builds: builds)
  end

  def show(conn, %{"id" => id}) do
    build = Builds.get_build!(id)
    render(conn, "show.json", build: build)
  end

  def create(conn, %{"project_id" => project_id, "data" => build_params}) do
    case Builds.create_build(project_id, build_params) do
      {:ok, build} ->
        conn
        |> put_status(:created)
        |> render("show.json", build: build)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(BeamWeb.API.ChangesetView, "error.json", changeset: changeset)
    end
  end
end
