# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Warp.Repo.insert!(%Warp.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

Warp.Projects.create(%{
  name: "timomeh/webhook_tstr",
  git: "git@github.com:timomeh/webhook_tstr.git",
  secret: "H9g00LWzKCdpETNYbmYazFzscTejRvJz",
  pipelines: [
    %{
      title: "Build & Deploy to Development",
      ref_match: "development$",
      human_id: "build_deploy_dev"
    },
    %{
      title: "Build & Deploy to Production",
      ref_match: "master$",
      human_id: "build_deploy_prod"
    }
  ]
})
