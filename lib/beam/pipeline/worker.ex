defmodule Beam.Pipeline.Worker do
  @moduledoc """
  Executes the command of a step and handles its state in the database.
  Returns :ok or :error depending on exit status of command.

  ## Example
    iex> Worker.run(step)
    :ok
  """

  alias Beam.Steps

  @doc false
  def run(step) do
    {step, output, exit_status} =
      step
      |> set_started()
      |> execute()

    set_finished(step, output, exit_status)

    case exit_status do
      0 -> :ok
      _ -> :error
    end
  end

  defp set_started(step) do
    step
    |> Steps.set_started()
    |> elem(1)
  end

  defp set_finished(step, output, exit_status) do
    state = if (exit_status == 0), do: "finished", else: "errored"

    step
    |> Steps.set_finished(output, state)
    |> elem(1)
  end

  defp execute(step) do
    [ command | args ] = String.split(step.command)
    {output, exit_status} = System.cmd(command, args, [stderr_to_stdout: true])
    {step, output, exit_status}
  end
end
