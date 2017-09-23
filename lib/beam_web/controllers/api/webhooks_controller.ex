defmodule BeamWeb.API.WebhooksController do
  use BeamWeb, :controller

  alias Beam.Projects
  alias Beam.Pipelines
  alias Beam.PipelineBootstrapper

  def receive(conn, %{"payload" => %{"zen" => zen}} = data) do
    conn
    |> send_resp(202, "")
  end

  def receive(conn, %{"payload" => payload} = data) do
    %{
      "ref" => ref,
      "after" => commit,
      "repository" => %{"ssh_url" => git}
    } = Poison.Parser.parse!(payload)

    # TODO: Match secrets

    project = Projects.get_project_by!(%{git: git})
    pipeline = Pipelines.get_pipeline_by_ref_match(project.pipelines, ref)

    {:ok, pid} = PipelineBootstrapper.start(pipeline, %{ref: ref, commit: commit, git: project.git})
    PipelineBootstrapper.run(pid)

    conn
    |> send_resp(202, "")
  end
end
