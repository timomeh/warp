defmodule BeamWeb.Router do
  use BeamWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", BeamWeb do
    pipe_through :browser

    # Insert route to static serve app's index.html
  end

  scope "/api", BeamWeb do
    pipe_through :api

    post "/webhooks/receive", API.WebhookController, :receive

    resources "/projects", API.ProjectController, only: [:index, :show, :create] do
      resources "/pipelines", API.PipelineController, only: [:index, :create]
    end

    resources "/pipelines", API.PipelineController, only: [:show] do
      resources "/builds", API.BuildController, only: [:index, :create]
    end

    resources "/builds", API.BuildController, only: [:show]
  end
end
