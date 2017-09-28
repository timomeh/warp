# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :warp,
  ecto_repos: [Warp.Repo]

# Configures the endpoint
config :warp, WarpWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "oO2SOMhaIvaQE/f4Ue8ACRGngUI9XrvS0LksHwMhsvxE5RhcsaJlbQtZ52CFwCAx",
  render_errors: [view: WarpWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Warp.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id, :reason]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
