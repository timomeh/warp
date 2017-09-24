defmodule Beam.Worker.TaskWorker do
  @moduledoc """
  Executes the command of a step and handles its state in the database.
  """

  use GenServer

  alias Beam.Steps
  alias Beam.LogCollector
  alias Phoenix.PubSub

  require Logger

  # Client

  @doc false
  def start_link(step) do
    state = %{
      step: step,
      debug_name: "#TaskWorker<#{step.id}>",
      output: nil
    }
    Process.flag(:trap_exit, true) # Process calls terminate() before shutdown
    GenServer.start(__MODULE__, state)
  end

  def run(pid) do
    GenServer.cast(pid, :run)
  end

  # Server callbacks

  def handle_cast(:run, state) do
    state
    |> log("START with command: #{state.step.run}")
    |> set_started()
    |> broadcast()
    |> execute()

    {:noreply, state}
  end

  def handle_cast(:graceful_halt, state) do
    state
    |> log("HALT RECEIVED. i'm going to brutally kill my child")
    |> Map.put(:status, "stopped")

    if (Map.has_key?(state, :task)), do: Task.shutdown(state.task, :brutal_kill)

    {:stop, :normal, {nil, state}}
  end

  @doc false
  def handle_info({_ref, {log_collector, exit_status}}, state) when exit_status == 0 do
    state =
      state
      |> log("SUCCESS executing command: #{state.step.run}")
      |> Map.put(:output, Enum.join(log_collector.lines))

    {:stop, :normal, state}
  end

  @doc false
  def handle_info({_ref, {log_collector, _exit_status}}, state) do
    state =
      state
      |> log("FAILED executing command: #{state.step.run}")
      |> Map.put(:output, Enum.join(log_collector.lines))

    {:stop, :error, state}
  end

  @doc false
  def handle_info(msg, state) do
    super(msg, state)
  end

  @doc false
  def terminate(reason, state) do
    case reason do
      :normal ->
        status = Map.get(state, :status, "success")
        state
        |> set_finished(status)
        |> broadcast()

      :error ->
        state
        |> set_finished("failed")
        |> broadcast()
    end
  end

  defp set_started(state) do
    {:ok, step} = Steps.update_started(state.step)
    Map.put(state, :step, step)
  end

  defp set_finished(state, status) do
    {:ok, step} = Steps.update_finished(state.step, state.output, status)
    Map.put(state, :step, step)
  end

  defp execute(step) do
    task = Task.async(fn ->
      System.cmd("sh", ["-c", step.run],
        [stderr_to_stdout: true, into: %LogCollector{step_id: step.id}]
      )
    end)

    Map.put(step, :task, task)
  end

  defp broadcast(state, event \\ "change") do
    topic = "step:#{state.step.id}"
    message = %{
      event: event,
      type: "step",
      data: state.step
    }
    PubSub.broadcast(Beam.PubSub, topic, message)
    state
  end


  defp log(%{debug_name: name} = state, text) do
    Logger.debug("#{name} #{text}")
    state
  end
end
