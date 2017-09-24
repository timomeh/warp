defmodule BeamWeb.API.BuildController do
  use BeamWeb, :controller

  alias Beam.Pipelines
  alias Beam.Builds
  alias Beam.Worker.BuildWorker

  def index(conn, %{"pipeline_id" => pipeline_id}) do
    instances =
      pipeline_id
      |> Pipelines.get!()
      |> Builds.all_by_pipeline()

    render(conn, "list.json", instances: instances)
  end

  def show(conn, %{"id" => id}) do
    instance = Builds.get!(id)
    render(conn, "show.json", instance: instance)
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
        |> render(BeamWeb.API.ChangesetView, "error.json", changeset: changeset)
    end
  end

  defp start_build(build) do
    {:ok, pid} = BuildWorker.start(build)
    BuildWorker.run(pid)
  end
end
