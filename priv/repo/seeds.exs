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

Beam.Projects.create(%{
  name: "timomeh/webhook_tstr",
  git: "git@github.com:timomeh/webhook_tstr.git",
  secret: "H9g00LWzKCdpETNYbmYazFzscTejRvJz",
  pipelines: [
    %{
      title: "Build & Deploy to Staging",
      ref_match: "^development$",
      human_id: "build_deploy_staging"
    },
    %{
      title: "Build & Deploy to Production",
      ref_match: "^master$",
      human_id: "build_deploy_staging"
    }
  ]
})
