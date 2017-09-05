defmodule BeamWeb.Router do
  use BeamWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", BeamWeb do
    pipe_through :browser # Use the default browser stack

    get "/deploy", PipeController, :index
    get "/deploy/trigger", PipeController, :send
    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", BeamWeb do
  #   pipe_through :api
  # end
end
