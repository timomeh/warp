defmodule BeamWeb.RoomChannel do
  use Phoenix.Channel

  alias Phoenix.PubSub

  def join("room:lobby", _message, socket) do
    PubSub.subscribe(Beam.PubSub, "build:x")
    {:ok, socket}
  end

  def handle_out("new_msg", payload, socket) do
    push socket, "new_msg", payload
    {:noreply, socket}
  end

  def handle_info(%{type: type, data: data}, socket) do
    payload =
      data
      |> strip_keys_for(type)
      |> convert_to_event(type)

    BeamWeb.Endpoint.broadcast("room:lobby", "new_msg", payload)

    {:noreply, socket}
  end

  defp convert_to_event(data, type) do
    %{
      event: "change",
      type: type,
      data: data
    }
  end

  defp strip_keys_for(data, type) when type == "build" do
    Map.take(data, [:id, :started_at, :finished_at, :state])
  end

  defp strip_keys_for(data, type) when type == "stage" do
    Map.take(data, [:id, :name, :started_at, :finished_at, :state])
  end

  defp strip_keys_for(data, type) when type == "step" do
    Map.take(data, [:id, :name, :started_at, :finished_at, :state, :command])
  end
end
