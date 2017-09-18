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

    resources "/projects", API.ProjectController do
      resources "/builds", API.BuildController
    end
  end
end
