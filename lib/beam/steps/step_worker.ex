defmodule Beam.Steps.StepWorker do
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
      debug_name: "#StepWorker<#{step.id}>"
    }
    Process.flag(:trap_exit, true) # Process calls terminate() before shutdown
    GenServer.start(__MODULE__, state)
  end

  def run(pid) do
    GenServer.cast(pid, :run)
  end

  # Server callbacks

  def handle_cast(:run, state) do
    log(state, "START with command: #{state.step.run}")
    broadcast(state.step)
    step =
      state.step
      |> set_started()
      |> execute()

    Map.put(state, :step, step)
    {:noreply, state}
  end

  def handle_cast(:graceful_halt, state) do
    log(state, "HALT RECEIVED. i'm going to brutally kill my child")
    if (Map.has_key?(state, :task)), do: Task.shutdown(state.task, :brutal_kill)

    state = Map.put(state, :status, "stopped")
    {:stop, :normal, {nil, state}}
  end

  @doc false
  def handle_info({_ref, {log_collector, exit_status}}, state) when exit_status == 0 do
    log(state, "SUCESS with command: #{state.step.run}")
    output = Enum.join(log_collector.lines)
    {:stop, :normal, {output, state}}
  end

  @doc false
  def handle_info({_ref, {log_collector, exit_status}}, state) do
    log(state, "FAILED to execute command: #{state.step.run}")
    output = Enum.join(log_collector.lines)
    {:stop, :error, {output, state}}
  end

  @doc false
  def handle_info(msg, state) do
    super(msg, state)
  end

  @doc false
  def terminate(reason, {output, state}) do
    case reason do
      :normal ->
        status = Map.get(state, :status, "success")
        state = set_finished({state, output, status})
        broadcast(state.step)
        # broadcast(state, stage)
      :error ->
        state = set_finished({state, output, "failed"})
        broadcast(state.step)
        # broadcast(state, stage)
        # Steps.stop_active_steps_in_stage(state.stage.id)
    end
  end

  defp set_started(step) do
    {:ok, step} = Steps.set_step_started(step)
    step
  end

  defp set_finished({state, output, status}) do
    {:ok, step} = Steps.set_step_finished(state.step, output, status)
    Map.put(state, :step, step)
  end

  defp broadcast(step, event \\ "change") do
    topic = "build:x"
    message = %{
      event: event,
      type: "step",
      data: step
    }
    PubSub.broadcast(Beam.PubSub, topic, message)
  end

  defp execute(step) do
    task = Task.async(fn ->
      System.cmd("sh", ["-c", step.run], [stderr_to_stdout: true, into: %LogCollector{step_id: step.id}])
    end)

    Map.put(step, :task, task)
  end

  defp log(%{debug_name: name}, text) do
    Logger.debug("#{name} #{text}")
  end
end
