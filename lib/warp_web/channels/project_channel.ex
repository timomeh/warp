defmodule WarpWeb.ProjectChannel do
  use Phoenix.Channel

  alias Phoenix.PubSub

  def join("project:" <> project_id, _message, socket) do
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

    WarpWeb.Endpoint.broadcast(socket.topic, "event", payload)

    {:noreply, socket}
  end

  defp convert_to_event(data, type, event) do
    %{
      event: "entity:#{event}:#{type}",
      data: data
    }
  end

  defp strip_keys_for(data, type) when type == "log" do
    Map.take(data, [:line, :step_id])
  end

  defp strip_keys_for(data, type) when type == "build" do
    Map.take(data, [:id, :ref, :started_at, :status, :started_at, :finished_at, :pipeline_id])
  end

  defp strip_keys_for(data, type) when type == "stage" do
    Map.take(data, [:id, :title, :status, :execution_type, :started_at, :finished_at])
  end

  defp strip_keys_for(data, type) when type == "step" do
    Map.take(data, [:id, :title, :execution_type, :run, :status, :log, :started_at, :finished_at])
  end

  defp strip_keys_for(data, _type) do
    data
  end
end
