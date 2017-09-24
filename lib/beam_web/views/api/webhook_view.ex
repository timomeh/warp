defmodule BeamWeb.API.WebhookView do
  use BeamWeb, :view

  def render("queueing.json", %{build: build}) do
    %{
      status: "queueing",
      message: "The build is queued to be executed.",
      build: %{
        id: build.id,
        ref: build.ref,
        commit: build.commit,
        status: build.status,
        pipeline_id: build.pipeline_id
      }
    }
  end

  def render("nothing.json", %{}) do
    %{
      status: "nothing",
      message: "There's no pipeline configured matching this ref."
    }
  end
end
