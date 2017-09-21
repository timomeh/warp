defmodule BeamWeb.API.PipelineController do
  use BeamWeb, :controller

  alias Beam.Pipelines
  alias Beam.Projects

  def show(conn, %{"id" => id}) do
    pipeline = Pipelines.get_pipeline!(id)
    render(conn, "show.json", pipeline: pipeline)
  end
end
