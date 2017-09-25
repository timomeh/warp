import { schema } from 'normalizr'

const singleStep = new schema.Entity('steps')
singleStep.define({ steps: [singleStep] })
export const step = singleStep

export const stage = new schema.Entity('stages', {
  steps: [step]
})

export const build = new schema.Entity('builds', {
  stages: [stage]
})

export const pipeline = new schema.Entity('pipelines')

export const project = new schema.Entity('projects', {
  latest_builds: [build],
  pipelines: [pipeline]
})
