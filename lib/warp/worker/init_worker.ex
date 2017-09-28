defmodule Warp.Worker.InitWorker do
  use GenServer

  alias Warp.Builds
  alias Warp.Worker.BuildWorker
  alias Warp.ConfigParser
  alias Phoenix.PubSub

  require Logger

  @sandbox_path "/Users/timomaemecke/Documents/dev/warp_deployments/"
  @config_file_name ".warp.yml"

  def start(%{build: build, git: git, pipeline_name: pipeline_name, project_id: project_id}) do
    state = %{
      build: build,
      pipeline_name: pipeline_name,
      build_dir: nil,
      build_full_path: nil,
      git: git,
      project_id: project_id,
      debug_name: "#InitWorker<#{build.id}>"
    }
    GenServer.start(__MODULE__, state)
  end

  def run(pid) do
    GenServer.cast(pid, :run)
  end

  def handle_cast(:run, %{build: build} = state) do
    state =
      state
      |> log("STARTING initializing build")
      |> set_init()
      |> broadcast()
      |> Map.put(:build_dir, get_build_dir(build))
      |> git_clone()
      |> create_full_build()
      |> log("FINISHED initializing build. starting build worker now")
      |> run_build_worker()
      |> log("GOODBYE. i'm done and worker is running")

    {:stop, :normal, state}
  end

  defp set_init(%{build: build} = state) do
    {:ok, build} = Builds.update_initializing(build)
    Map.put(state, :build, build)
  end

  defp get_build_dir(build) do
    time_str =
      DateTime.utc_now()
      |> DateTime.to_unix()

    "#{build.id}_#{time_str}"
  end

  defp git_clone(%{build_dir: build_dir, build: build, git: git} = state) do
    System.cmd("git", ["clone", git, build_dir], cd: @sandbox_path)
    System.cmd("git", ["checkout", build.commit.commit_sha], cd: "#{@sandbox_path}#{build_dir}")
    Map.put(state, :build_full_path, "#{@sandbox_path}#{build_dir}")
  end

  defp create_full_build(%{build_full_path: build_full_path, build: build, pipeline_name: pipeline_name} = state) do
    build_config = ConfigParser.get_pipeline_instance("#{build_full_path}/#{@config_file_name}", pipeline_name)

    {:ok, build} =
      build
      |> Builds.update(%{
          stages: build_config.stages,
          working_dir: build_full_path
        })

    Map.put(state, :build, build)
  end

  defp run_build_worker(state) do
    {:ok, pid} = BuildWorker.start(state.build, state.project_id)
    BuildWorker.run(pid)
    state
  end

  defp broadcast(state, event \\ "change") do
    topic = "project:#{state.project_id}"
    message = %{
      event: event,
      type: "build",
      data: state.build
    }
    PubSub.broadcast(Warp.PubSub, topic, message)
    state
  end

  defp log(%{debug_name: name} = state, text) do
    Logger.debug("#{name} #{text}")
    state
  end
end
