defmodule Beam.ConfigParser do
  def get_pipeline_instance(filepath, ref) do
    filepath
    |> get_pipeline(ref)
    |> transform_to_pipeline()
  end

  def get_pipeline(filepath, ref) do
    filepath
    |> parse_file()
    |> get_by_ref(ref)
  end

  def get_pipelines(filepath) do
    filepath
    |> parse_file()
    |> get_all()
  end

  defp parse_file(filepath) do
    YamlElixir.read_from_file(filepath)
  end

  defp get_by_ref(config, ref) do
    config["pipelines"]
    |> Enum.find(&(Regex.match?(Regex.compile!(&1["ref"]), ref)))
    |> include_stages(config["stages"])
  end

  defp get_all(config) do
    config["pipelines"]
    |> Enum.map(&(include_stages(&1, config["stages"])))
  end

  defp include_stages(pipeline, stages) do
    expanded_stages =
      pipeline["stages"]
      |> Enum.map(fn stage ->
        case stage do
          %{"include" => stage_id} ->
            Enum.find(stages, &(&1["id"] == stage_id))
            |> Map.delete("id")
          _ -> stage
        end
      end)

    Map.put(pipeline, "stages", expanded_stages)
  end

  defp transform_to_pipeline(pipeline) do
    stages =
      pipeline["stages"]
      |> Enum.map(&(transform_nested_steps(&1, "steps")))
      |> Enum.with_index()
      |> Enum.map(fn {stage, i} -> Map.put(stage, "ordinal_rank", i) end)

    Map.put(pipeline, "stages", stages)
  end

  defp transform_nested_steps(map_with_steps, key_name) do
    case map_with_steps do
      %{"steps_parallel" => steps_parallel} ->
        map_with_steps
        |> Map.merge(%{"execution_type" => "parallel"})
        |> Map.put(key_name, Enum.map(steps_parallel, &(transform_nested_steps(&1, "substeps"))))
        |> Map.delete("steps_parallel")

      %{"steps_serial" => steps_serial} ->
        steps =
          steps_serial
          |> Enum.map(&(transform_nested_steps(&1, "substeps")))
          |> Enum.with_index()
          |> Enum.map(fn {stage, i} -> Map.put(stage, "ordinal_rank", i) end)

        map_with_steps
        |> Map.merge(%{"execution_type" => "serial"})
        |> Map.put(key_name, steps)
        |> Map.delete("steps_serial")

      _ ->
        map_with_steps
        |> Map.put_new("name", map_with_steps["run"])
    end
  end
end
