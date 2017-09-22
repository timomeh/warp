defmodule BeamWeb.API.PipelineInstanceController do
  use BeamWeb, :controller

  alias Beam.Pipelines
  alias Beam.Pipelines.PipelineWorker
  alias Beam.Projects
  alias Beam.ConfigParser

  @config_file_name "beamfile.yml"

  def index(conn, %{"pipeline_id" => pipeline_id}) do
    pipeline_instances = Pipelines.get_pipeline_instances!(pipeline_id)
    render(conn, "list.json", pipeline_instances: pipeline_instances)
  end

  def show(conn, %{"pipeline_id" => _pipeline_id, "id" => id}) do
    pipeline_instance = Pipelines.get_pipeline_instance!(id)
    render(conn, "show.json", pipeline_instance: pipeline_instance)
  end

  def create(conn, %{"pipeline_id" => pipeline_id}) do
    project_id =
      pipeline_id
      |> Pipelines.get_pipeline!()
      |> Map.fetch!(:project_id)

    create_pipeline_instance =
      project_id
      |> Projects.get_project!()
      |> Map.fetch!(:root_directory)
      |> Path.join(@config_file_name)
      |> ConfigParser.get_pipeline_instance("development")
      |> Pipelines.create_pipeline_instance(project_id)

    case create_pipeline_instance do
      {:ok, pipeline_instance} ->
        start_pipeline(pipeline_instance)

        conn
        |> put_status(:created)
        |> render("show.json", pipeline_instance: pipeline_instance)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(BeamWeb.API.ChangesetView, "error.json", changeset: changeset)
    end
  end

  defp start_pipeline(pipeline) do
    {:ok, pid} = PipelineWorker.start(pipeline)
    PipelineWorker.run(pid)
  end
end
