defmodule Beam.LogCollector do
  defstruct lines: [], step_id: nil
end

defimpl Collectable, for: Beam.LogCollector do
  alias Phoenix.PubSub

  def into(original) do
    collector_fun = fn
      log, {:cont, line} ->
        PubSub.broadcast(Beam.PubSub, "step:log:#{log.step_id}", %{
          event: "add",
          type: "log",
          data: %{step_id: log.step_id, line: line}
        })
        %Beam.LogCollector{log | lines: log.lines ++ [line]}
      log, :done -> log
      _log, :halt -> :ok
    end

    {original, collector_fun}
  end
end
