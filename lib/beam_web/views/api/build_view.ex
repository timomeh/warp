defmodule BeamWeb.API.BuildView do
  use BeamWeb, :view

  alias BeamWeb.API.BuildView


  def render("show.json", %{build: build}) do
    %{data: render_one(build, BuildView, "build.json")}
  end

  def render("list.json", %{builds: builds}) do
    %{data: render_many(builds, BuildView, "build.json")}
  end

  def render("build.json", %{build: build}) do
    %{
      id: build.id,
      state: build.state,
      started_at: build.started_at,
      finished_at: build.finished_at
    }
  end
end
