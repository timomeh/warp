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

project = Beam.Repo.insert!(%Beam.Projects.Project{
  name: "timomeh/beam",
  git: "https://github.com/timomeh/beam",
  root_directory: "/Users/timomaemecke/Documents/dev/beam/"
})

Beam.ConfigParser.get_pipelines("/Users/timomaemecke/Documents/dev/beam/beamfile.yml")
|> Enum.each(fn pipeline ->
  pipeline = Map.put(pipeline, "project_id", project.id)
  Beam.Repo.insert!(Beam.Pipelines.Pipeline.changeset(%Beam.Pipelines.Pipeline{}, pipeline))
end)
