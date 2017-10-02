defmodule Warp.LogCollector do
  defstruct lines: [], step_id: nil, project_id: nil
end

defimpl Collectable, for: Warp.LogCollector do
  alias Phoenix.PubSub

  def into(original) do
    collector_fun = fn
      log, {:cont, line} ->
        PubSub.broadcast(Warp.PubSub, "project:#{log.project_id}", %{
          event: "add",
          type: "log",
          data: %{step_id: log.step_id, line: line}
        })
        %Warp.LogCollector{log | lines: log.lines ++ [line]}
      log, :done -> log
      _log, :halt -> :ok
    end

    {original, collector_fun}
  end
end
