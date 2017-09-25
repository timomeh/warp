defmodule BeamWeb.API.WebhookController do
  use BeamWeb, :controller

  alias Beam.Projects
  alias Beam.Pipelines
  alias Beam.Builds
  alias Beam.Worker.InitWorker
  alias Phoenix.PubSub

  def receive(conn, %{"payload" => %{"zen" => zen}}) do
    conn
    |> put_status(202)
    |> json(%{status: "ok", zen: zen})
  end

  def receive(conn, %{"payload" => payload}) do
    %{
      "ref" => ref,
      "after" => commit,
      "repository" => %{"ssh_url" => git}
    } = Poison.Parser.parse!(payload)

    # TODO: Match secrets

    pipeline =
      %{git: git}
      |> Projects.get_by!()
      |> Map.get(:pipelines)
      |> Pipelines.get_by_ref_match(ref)

    if is_nil(pipeline) do
      conn
      |> put_status(:ok)
      |> render("nothing.json", %{})

    else
      case Builds.create_queueing(pipeline, %{ref: ref, commit: commit}) do
        {:ok, build} ->
          broadcast(build, pipeline)
          start_worker(build, git, pipeline.human_id)

          conn
          |> put_status(:accepted)
          |> render("queueing.json", build: build)
        {:error, changeset} ->
          conn
          |> put_status(:bad_request)
          |> render(BeamWeb.API.ChangesetView, "error.json", changeset: changeset)
      end
    end
  end

  defp broadcast(build, pipeline) do
    topic = "pipeline:#{pipeline.id}"
    message = %{
      event: "create",
      type: "build",
      data: build
    }
    PubSub.broadcast(Beam.PubSub, "build:x", message)
  end

  defp start_worker(build, git, pipeline_name) do
    {:ok, pid} = InitWorker.start(%{build: build, git: git, pipeline_name: pipeline_name})
    InitWorker.run(pid)
  end
end
