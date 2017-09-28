import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import * as schema from 'lib/schema'
import api from 'lib/api'
import projects from './projects'
import project from './project'
import pipelines from './pipelines'
import builds from './builds'
import build from './build'
import stages from './stages'
import steps from './steps'

const rootReducer = combineReducers({
  projects,
  project,
  pipelines,
  builds,
  build,
  stages,
  steps
})

const store = createStore(
  rootReducer,
  applyMiddleware(thunk.withExtraArgument({ api, schema }))
)

export default store

export const ADD_ENTITIES = 'warp/core/ADD_ENTITIES'
export const addEntities = entities => ({
  type: ADD_ENTITIES,
  entities
})

// Re-export all action creators
export * from './projects'
export * from './project'
export * from './builds'
export * from './build'
export * from './steps'
