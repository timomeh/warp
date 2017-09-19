import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import projects from './projects'
import * as schema from '../schema'
import api from '../api'

const rootReducer = combineReducers({
  projects
})

const store = createStore(
  rootReducer,
  applyMiddleware(thunk.withExtraArgument({ api, schema }))
)

export default store

// Re-export all action creators
export * from './projects'
