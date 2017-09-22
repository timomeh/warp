defmodule BeamWeb.RoomChannel do
  use Phoenix.Channel

  alias Phoenix.PubSub

  def join("room:lobby", _message, socket) do
    PubSub.subscribe(Beam.PubSub, "build:x")
    {:ok, socket}
  end

  def handle_out("event", payload, socket) do
    push socket, "event", payload
    {:noreply, socket}
  end

  def handle_info(%{type: type, data: data, event: event}, socket) do
    payload =
      data
      |> strip_keys_for(type)
      |> convert_to_event(type, event)

    BeamWeb.Endpoint.broadcast("room:lobby", "event", payload)

    {:noreply, socket}
  end

  defp convert_to_event(%{step_id: step_id, line: line}, type) when type == "log" do
    %{event: "log", step_id: step_id, data: line}
  end

  defp convert_to_event(data, type, event \\ "change") do
    %{
      event: "entity:#{event}:#{type}",
      data: data
    }
  end

  defp strip_keys_for(data, type) when type == "pipeline" do
    Map.take(data, [:id, :type, :started_at, :finished_at, :state, :project_id])
  end

  defp strip_keys_for(data, type) when type == "stage" do
    Map.take(data, [:id, :name, :started_at, :finished_at, :state])
  end

  defp strip_keys_for(data, type) when type == "step" do
    Map.take(data, [:id, :name, :started_at, :finished_at, :state, :command])
  end

  defp strip_keys_for(data, _type) do
    data
  end
end
