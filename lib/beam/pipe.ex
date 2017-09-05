defmodule Beam.Pipe do
  require Logger
  use GenServer

  def start_link(deployment_id, state) do
    GenServer.start_link(__MODULE__, state, name: ref(deployment_id))
  end

  def init(state), do: {:ok, state}

  def handle_cast({:start, event_handler}, state) do
    start(state, event_handler)
    {:noreply, state}
  end

  def handle_cast({:stop}, state) do
    {:stop, :normal, state}
  end

  def terminate(reason, _state) do
    Logger.info ["Terminating GenServer: #{__MODULE__}", "\n", "  Reason: #{reason}"]
  end

  def stop(pid) do
    GenServer.cast(pid, {:stop})
  end

  defp start([current_step | next_steps], event_handler) do
    spawn_job(current_step, next_steps, event_handler)
  end

  defp spawn_job(current_step, next_steps, event_handler) do
    [ cmd | args ] = String.split(current_step)
    result = System.cmd(cmd, args)
    event_handler.({:data, elem(result, 0)})

    if Enum.empty?(next_steps) do
      event_handler.({:done})
    else
      [ next_step | more_steps ] = next_steps
      spawn_job(next_step, more_steps, event_handler)
    end
  end

  defp ref(deployment_id) do
    {:global, deployment_id}
  end
end
