defmodule Beam.Pipelines do
  @moduledoc """
  The Pipelines context.
  """

  import Ecto.Query, warn: false

  alias Beam.Repo
  alias Beam.Pipelines
  alias Beam.Pipelines.Pipeline
  alias Beam.Pipelines.PipelineInstance
  alias Beam.Steps.Step
  alias Beam.Steps
  alias Beam.Stages.Stage
  alias Beam.Projects.Project

  def create_pipeline(attrs, project_id) do
    %Pipeline{}
    |> Pipeline.changeset(attrs)
    |> Ecto.Changeset.merge(Pipeline.changeset(%Pipeline{}, %{project_id: project_id}))
    |> Repo.insert()
  end

  def create_pipeline_instance(attrs, project_id) do
    pipeline = get_pipeline_by_ref!(project_id, attrs["ref"])

    %PipelineInstance{}
    |> PipelineInstance.changeset(attrs)
    |> Ecto.Changeset.merge(PipelineInstance.changeset(%PipelineInstance{}, %{project_id: project_id, pipeline_id: pipeline.id}))
    |> Repo.insert()
  end

  def list_pipelines(project_id) do
    Repo.get!(Project, project_id) # raise if project does not exist

    from(pipe in Pipeline, where: pipe.project_id == ^project_id)
    |> Repo.all()
  end

  def get_pipeline!(id) do
    Repo.get!(Pipeline, id)
  end

  def get_pipeline_by_ref!(project_id, ref) do
    Repo.get_by!(Pipeline, [ref: ref, project_id: project_id])
  end

  def get_pipeline_instances!(pipeline_id) do
    from(instance in PipelineInstance, where: instance.pipeline_id == ^pipeline_id)
    |> Repo.all()
  end

  def get_pipeline_instance!(id) do
    step_query = from(step in Step, order_by: step.ordinal_rank)
    stage_query = from(stage in Stage, order_by: stage.ordinal_rank, preload: [steps: ^step_query])

    pi =
      Repo.get!(PipelineInstance, id)
      |> Repo.preload([ stages: stage_query ])

    stages =
      Enum.map(pi.stages, fn stage ->
        Map.put(stage, :steps, Steps.fill_substeps(stage.steps))
      end)

    Map.put(pi, :stages, stages)
  end

  def update_instance(%PipelineInstance{} = pipeline_instance, attrs) do
    pipeline_instance
    |> PipelineInstance.changeset(attrs)
    |> Repo.update()
  end

  def set_instance_started(%PipelineInstance{} = instance) do
    update_instance(instance, %{started_at: DateTime.utc_now(), status: "active"})
  end

  def set_instance_finished(%PipelineInstance{} = instance, status \\ "success") do
    update_instance(instance, %{finished_at: DateTime.utc_now(), status: status})
  end
end
