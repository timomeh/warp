defmodule WarpWeb.API.WebhookController do
  use WarpWeb, :controller

  alias Warp.Projects
  alias Warp.Pipelines
  alias Warp.Repo
  alias Warp.Builds
  alias Warp.Worker.InitWorker
  alias Phoenix.PubSub

  def receive(conn, %{"payload" => %{"zen" => zen}}) do
    conn
    |> put_status(202)
    |> json(%{status: "ok", zen: zen})
  end

  def receive(conn, %{"payload" => payload}) do
    %{
      "ref" => ref,
      "head_commit" => commit,
      "sender" => sender,
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
      {:ok, commit_timestamp, _} = DateTime.from_iso8601(commit["timestamp"])

      attrs = %{
        ref: ref,
        commit: %{
          commit_sha: commit["id"],
          message: commit["message"],
          timestamp: commit_timestamp,
          foreign_url: commit["url"],
          sender_name: sender["login"],
          sender_avatar: sender["avatar_url"]
        }
      }

      case Builds.create_queueing(pipeline, attrs) do
        {:ok, build} ->
          build =
            build
            |> Repo.preload(:commit)
            |> broadcast(pipeline)
            |> start_worker(git, pipeline.human_id, pipeline.project_id)

          conn
          |> put_status(:accepted)
          |> render("queueing.json", build: build)
        {:error, changeset} ->
          conn
          |> put_status(:bad_request)
          |> render(WarpWeb.API.ChangesetView, "error.json", changeset: changeset)
      end
    end
  end

  defp broadcast(build, pipeline) do
    topic = "project:#{pipeline.project_id}"
    message = %{
      event: "create",
      type: "build",
      data: build
    }
    PubSub.broadcast(Warp.PubSub, topic, message)
    build
  end

  defp start_worker(build, git, pipeline_name, project_id) do
    {:ok, pid} = InitWorker.start(%{
      build: build,
      git: git,
      pipeline_name: pipeline_name,
      project_id: project_id
    })
    InitWorker.run(pid)

    build
  end
end
