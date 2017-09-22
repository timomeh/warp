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

  defp strip_keys_for(data, type) when type == "pipeline_instance" do
    Map.take(data, [:id, :name, :ref, :matched_ref, :commit, :status, :started_at, :finished_at, :project_id, :pipeline_id])
  end

  defp strip_keys_for(data, type) when type == "stage" do
    Map.take(data, [:id, :name, :status, :execution_type, :started_at, :finished_at, :pipeline_instance_id])
  end

  defp strip_keys_for(data, type) when type == "step" do
    Map.take(data, [:id, :run, :status, :log, :started_at, :finished_at, :execution_type, :parent_step_id, :stage_id])
  end

  defp strip_keys_for(data, _type) do
    data
  end
end
