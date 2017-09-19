import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import * as schema from 'lib/schema'
import api from 'lib/api'
import projects from './projects'
import builds from './builds'

const rootReducer = combineReducers({
  projects,
  builds
})

const store = createStore(
  rootReducer,
  applyMiddleware(thunk.withExtraArgument({ api, schema }))
)

export default store

export const ADD_ENTITIES = 'beam/core/ADD_ENTITIES'
export const addEntities = entities => ({
  type: ADD_ENTITIES,
  entities
})

// Re-export all action creators
export * from './projects'
