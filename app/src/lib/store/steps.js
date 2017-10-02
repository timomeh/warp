import { ADD_ENTITIES } from 'lib/store'
import merge from 'deepmerge'

const ADD_LOG_LINE = 'warp/steps/ADD_LOG_LINE'

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

    case ADD_LOG_LINE:
      const step = {
        [action.id]: {
          ...state.entities[action.id],
          log: (state.entities[action.id].log || '') + action.line
        }
      }

      return {
        ...state,
        entities: merge(state.entities, step)
      }

    default:
      return state
  }
}

export const addLogLine = (stepId, line) => ({
  type: ADD_LOG_LINE,
  id: stepId,
  line
})

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
