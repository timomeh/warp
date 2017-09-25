import { schema } from 'normalizr'

export const build = new schema.Entity('builds')

export const pipeline = new schema.Entity('pipelines')

export const project = new schema.Entity('projects', {
  latest_builds: [build],
  pipelines: [pipeline]
})
