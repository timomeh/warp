defmodule Beam.Pipe do
  def start([ current_step | next_steps ], callback) do
    spawn_job(current_step, next_steps, callback)
  end

  defp spawn_job(current_step, next_steps, callback) do
    [ cmd | args ] = String.split(current_step)
    result = System.cmd(cmd, args)
    callback.({:data, elem(result, 0)})

    if Enum.empty?(next_steps) do
      callback.({:done})
    else
      [ next_step | more_steps ] = next_steps
      spawn_job(next_step, more_steps, callback)
    end
  end
end
