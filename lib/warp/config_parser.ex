defmodule Warp.ConfigParser do
  def get_pipeline_instance(filepath, name) do
    filepath
    |> get_pipeline(name)
    |> transform_to_pipeline()
  end

  def get_pipeline(filepath, id) do
    filepath
    |> parse_file()
    |> get_by_ref(id)
  end

  defp parse_file(filepath) do
    YamlElixir.read_from_file(filepath)
  end

  defp get_by_ref(config, name) do
    config["pipelines"][name]
    |> include_includes(config["includes"])
  end

  defp include_includes(map, includes) do
    map
    |> Map.keys()
    |> Enum.map(fn key ->
      value =
        case key do
          "include" -> includes[map[key]]
          _ -> map[key]
        end

      new_value =
        case value do
          %{} -> include_includes(value, includes)
          [_ | _] -> Enum.map(value, &(include_includes(&1, includes)))
          _ -> value
        end

      case key do
        "include" -> new_value
        _ -> Map.put(%{}, String.to_atom(key), new_value)
      end
    end)
    |> Enum.flat_map_reduce(%{}, &({&1, Map.merge(&2, &1)}))
    |> elem(1)
  end

  defp transform_to_pipeline(pipeline) do
    stages =
      pipeline.stages
      |> Enum.map(&(transform_nested_steps(&1, :steps)))
      |> Enum.with_index()
      |> Enum.map(fn {stage, i} -> Map.put(stage, :ordinal_rank, i) end)

    Map.put(pipeline, :stages, stages)
  end

  defp transform_nested_steps(map_with_steps, key_name) do
    case map_with_steps do
      %{:steps_parallel => steps_parallel} ->
        map_with_steps
        |> Map.merge(%{:execution_type => "parallel"})
        |> Map.put(key_name, Enum.map(steps_parallel, &(transform_nested_steps(&1, :substeps))))
        |> Map.delete(:steps_parallel)

      %{:steps_serial => steps_serial} ->
        steps =
          steps_serial
          |> Enum.map(&(transform_nested_steps(&1, :substeps)))
          |> Enum.with_index()
          |> Enum.map(fn {stage, i} -> Map.put(stage, :ordinal_rank, i) end)

        map_with_steps
        |> Map.merge(%{:execution_type => "serial"})
        |> Map.put(key_name, steps)
        |> Map.delete(:steps_serial)

      _ ->
        map_with_steps
        |> Map.put_new(:title, map_with_steps.run)
    end
  end
end
