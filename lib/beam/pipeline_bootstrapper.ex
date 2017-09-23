defmodule Beam.PipelineBootstrapper do
  use GenServer

  @sandbox_path "/Users/timomaemecke/Documents/dev/beam_deployments/"

  def start(pipeline, instance_data) do
    state = %{pipeline: pipeline, instance_data: instance_data}
    GenServer.start(__MODULE__, state)
  end

  def run(pid) do
    GenServer.cast(pid, :run)
  end

  def handle_cast(:run, %{instance_data: %{git: git, commit: commit_sha}} = state) do
    state.pipeline
    |> get_new_directory_name()
    |> git_clone(git, commit_sha)

    {:stop, :normal, state}
  end

  def get_new_directory_name(pipeline) do
    time_str =
      DateTime.utc_now()
      |> DateTime.to_unix()

    "#{pipeline.id}_#{time_str}"
  end

  def git_clone(directory, repo, commit_sha) do
    System.cmd("git", ["clone", repo, directory], cd: @sandbox_path)
    System.cmd("git", ["checkout", commit_sha], cd: "#{@sandbox_path}#{directory}")
  end
end
