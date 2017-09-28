defmodule WarpWeb.API.BuildView do
  use WarpWeb, :view

  alias WarpWeb.API.StageView

  def render("show.json", %{build: build}) do
    %{data: render_one(build, __MODULE__, "build.json")}
  end

  def render("list.json", %{builds: builds}) do
    %{data: render_many(builds, __MODULE__, "build.json")}
  end

  def render("build.json", %{build: build}) do
    output = %{
      id: build.id,
      ref: build.ref,
      commit_sha: build.commit_sha,
      status: build.status,
      started_at: build.started_at,
      finished_at: build.finished_at,
      pipeline_id: build.pipeline_id,
      stages: []
    }

    case build.stages do
      %Ecto.Association.NotLoaded{} ->
        output
      _ ->
        Map.put(output, :stages, render_many(build.stages, StageView, "stage.json"))
    end
  end
end
