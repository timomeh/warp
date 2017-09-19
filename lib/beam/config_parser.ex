defmodule Beam.ConfigParser do
  def get_stages_from_file(filepath) do
    filepath
    |> read_file()
    |> get_build_attrs()
  end

  defp read_file(filepath) do
    YamlElixir.read_from_file(filepath)
  end

  defp get_build_attrs(list) do
    list
    |> Map.take(["type", "stages"])
  end
end
