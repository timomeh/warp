defmodule Beam.Pipeline.Worker do
  @moduledoc """
  Executes the command of a step and handles its state in the database.
  Returns :ok or :error depending on exit status of command.

  ## Example
    iex> Worker.run(step)
    :ok
  """

  alias Beam.Steps
  alias Beam.LogCollector
  alias Phoenix.PubSub

  @doc false
  def run(step) do
    step
    |> set_started()
    |> execute()
    |> set_finished()
    |> handle_exit()
  end

  defp set_started(step) do
    {:ok, step} = Steps.set_started(step)
    broadcast(step)
    step
  end

  defp set_finished({step, output, exit_status}) do
    state = if (exit_status == 0), do: "finished", else: "errored"
    log = Enum.join(output.lines)
    {:ok, step} = Steps.set_finished(step, log, state)
    broadcast(step)

    {step, output, exit_status}
  end

  defp handle_exit({_step, _output, exit_status}) do
    case exit_status do
      0 -> :ok
      _ -> :error
    end
  end

  defp broadcast(step) do
    topic = "build:x"
    message = %{
      type: "step",
      data: step
    }
    PubSub.broadcast(Beam.PubSub, topic, message)
  end

  defp execute(step) do
    [ command | args ] = String.split(step.command)
    {output, exit_status} = System.cmd(command, args, [stderr_to_stdout: true, into: %LogCollector{step_id: step.id}])
    {step, output, exit_status}
  end
end
