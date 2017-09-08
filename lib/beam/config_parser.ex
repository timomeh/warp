defmodule Beam.ConfigParser do
  def get_stages_from_file(filepath) do
    filepath
    |> read_file()
    |> get_stages()
  end

  defp read_file(filepath) do
    YamlElixir.read_from_file(filepath)
  end

  defp get_stages(list) do
    list
    |> Map.take(["stages"])
  end
end
