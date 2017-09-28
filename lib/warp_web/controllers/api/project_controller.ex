defmodule WarpWeb.API.ProjectController do
  use WarpWeb, :controller

  alias Warp.Projects
  alias Warp.Builds

  def index(conn, _params) do
    projects =
      Projects.list()
      |> Enum.map(&(preload_latest_builds(&1)))

    render(conn, "list.json", projects: projects)
  end

  def show(conn, %{"id" => id}) do
    project =
      Projects.get!(id)
      |> preload_latest_builds()

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
        |> render(WarpWeb.API.ChangesetView, "error.json", changeset: changeset)
    end
  end

  defp preload_latest_builds(project) do
    latest_builds =
      project.pipelines
      |> Enum.map(&(Builds.all_distinct_latest_by_pipeline(&1)))
      |> List.flatten()
      |> Enum.sort(&(DateTime.compare(&1.started_at, &2.started_at) == :gt))
      |> Enum.map(&(Builds.preload_stages(&1)))

    Map.put(project, :latest_builds, latest_builds)
  end

  defp generate_secret(length) do
    :crypto.strong_rand_bytes(length)
    |> Base.url_encode64()
    |> binary_part(0, length)
  end
end
