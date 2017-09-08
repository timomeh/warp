defmodule BeamWeb.API.BuildView do
  use BeamWeb, :view

  alias BeamWeb.API.Stages.Stage
  alias BeamWeb.API.StageView

  def render("show.json", %{build: build}) do
    %{data: render_one(build, __MODULE__, "build.json")}
  end

  def render("list.json", %{builds: builds}) do
    %{data: render_many(builds, __MODULE__, "build.json")}
  end

  def render("build.json", %{build: build}) do
    output = %{
      id: build.id,
      state: build.state,
      started_at: build.started_at,
      finished_at: build.finished_at
    }

    case build.stages do
      %Ecto.Association.NotLoaded{} ->
        output
      _ ->
        Map.put(output, :stages, render_many(build.stages, StageView, "stage.json"))
    end
  end
end
