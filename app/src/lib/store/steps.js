import { ADD_ENTITIES } from 'lib/store'
import merge from 'deepmerge'

const initialState = {
  entities: {}
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ENTITIES:
      if (action.entities.steps == null) return state
      return {
        ...state,
        entities: merge(state.entities, action.entities.steps)
      }

    default:
      return state
  }
}

export function getStepLeaves(stepList, allSteps) {
  return stepList
    .map(id => {
      const step = allSteps[id]
      if (step.hasOwnProperty('steps')) return getStepLeaves(step.steps, allSteps)
      return id
    })
    .reduce((acc, cur) => acc.concat(cur), [])
}

export function populateSteps(group, allSteps) {
  const g = { ...group }
  g.steps = g.steps && g.steps.map(stepId => populateSteps(allSteps[stepId], allSteps))
  return g
}
