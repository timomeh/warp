# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Beam.Repo.insert!(%Beam.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

Beam.Projects.create_project(%{
  name: "timomeh/beam",
  git: "https://github.com/timomeh/beam",
  secret: "H9g00LWzKCdpETNYbmYazFzscTejRvJz",
  pipelines: [
    %{
      title: "Build & Deploy to Staging",
      ref_match: "/^development$/",
      human_id: "build_deploy_staging",
      init_config: "steps_serial:\n- run: git clone git@github.com:timomeh/beam.git --branch master --single-branch"
    },
    %{
      title: "Build & Deploy to Production",
      ref_match: "/^master$/",
      human_id: "build_deploy_staging",
      init_config: "steps_serial:\n- run: git clone git@github.com:timomeh/beam.git --branch master --single-branch"
    }
  ]
})
