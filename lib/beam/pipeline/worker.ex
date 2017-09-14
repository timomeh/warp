defmodule Beam.Pipeline.Worker do
  use Task

  alias Beam.Steps

  def start_link(step) do
    Task.start_link(__MODULE__, :run, [step])
  end

  def run(step) do
    step
    |> set_started()
    |> execute()
    |> set_finished()
  end

  defp set_started(step) do
    step
    |> Steps.set_started()
    |> elem(1)
  end

  defp set_finished({step, output, exit_status}) do
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
