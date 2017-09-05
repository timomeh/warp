defmodule BeamWeb.PipeController do
  use BeamWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def send(conn, _params) do
    BeamWeb.Endpoint.broadcast("room:lobby", "new_msg", %{hello: "world", body: "pipeline started"})

    tasks = [
      "sh /Users/timomaemecke/Documents/dev/beam/foo",
      "sh /Users/timomaemecke/Documents/dev/beam/bar",
      "sh /Users/timomaemecke/Documents/dev/beam/foobar"
    ]

    {:ok, pid} = Beam.Pipe.start_link("depl#{:os.system_time(:seconds)}", tasks)
    event_handler = fn
      {:data, body} -> BeamWeb.Endpoint.broadcast("room:lobby", "new_msg", %{event: "data", body: body})
      {:done} ->
        BeamWeb.Endpoint.broadcast("room:lobby", "new_msg", %{event: "done"})
        Beam.Pipe.stop(pid)
    end

    GenServer.cast(pid, {:start, event_handler})
    render conn, "index.html"
  end
end
