defmodule WarpWeb.API.BuildController do
  use WarpWeb, :controller

  alias Warp.Projects
  alias Warp.Pipelines
  alias Warp.Builds
  alias Warp.Worker.BuildWorker

  def index(conn, %{"pipeline_id" => pipeline_id}) do
    builds =
      pipeline_id
      |> Pipelines.get!()
      |> Builds.all_by_pipeline()
      |> Enum.map(&(Builds.preload_stages(&1)))

    render(conn, "list.json", builds: builds)
  end

  def index_by_project(conn, %{"project_id" => project_id}) do
    builds =
      project_id
      |> Projects.get!()
      |> Builds.all_by_project()

    render(conn, "list.json", builds: builds)
  end

  def show(conn, %{"id" => id}) do
    build =
      id
      |> Builds.get!()
      |> Builds.preload_stages()

    render(conn, "show.json", build: build)
  end

  def create(conn, %{"pipeline_id" => pipeline_id}) do
    create_build =
      pipeline_id
      |> Pipelines.get!()
      |> Builds.create_queueing() # TODO: attrs when POST?

    case create_build do
      {:ok, build} ->
        start_build(build)

        conn
        |> put_status(:created)
        |> render("show.json", build: build)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(WarpWeb.API.ChangesetView, "error.json", changeset: changeset)
    end
  end

  defp start_build(build) do
    {:ok, pid} = BuildWorker.start(build)
    BuildWorker.run(pid)
  end
end
