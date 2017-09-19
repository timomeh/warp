import { schema } from 'normalizr'

export const build = new schema.Entity('builds')

export const project = new schema.Entity('projects', {
  latest_builds: [ build ]
})
