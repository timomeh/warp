defmodule BeamWeb.API.BuildController do
  use BeamWeb, :controller

  alias Beam.Builds
  alias Beam.Projects
  alias Beam.ConfigParser
  alias Beam.Pipeline.Conductor

  @config_file_name "beamfile.yml"

  def index(conn, %{"project_id" => project_id}) do
    builds = Builds.list_builds(project_id)
    render(conn, "list.json", builds: builds)
  end

  def show(conn, %{"id" => id}) do
    build = Builds.get_build!(id)
    render(conn, "show.json", build: build)
  end

  def create(conn, %{"project_id" => project_id}) do
    parse_and_create_build =
      Projects.get_project!(project_id)
      |> Map.fetch!(:root_directory)
      |> Path.join(@config_file_name)
      |> ConfigParser.get_stages_from_file()
      |> Builds.create_build(project_id)

    case parse_and_create_build do
      {:ok, build} ->
        start_pipeline(build)

        conn
        |> put_status(:created)
        |> render("show.json", build: build)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(BeamWeb.API.ChangesetView, "error.json", changeset: changeset)
    end
  end

  defp start_pipeline(build) do
    {:ok, pid} = Conductor.start(build)
    Conductor.run(pid)
  end
end
