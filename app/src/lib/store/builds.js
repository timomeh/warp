import { ADD_ENTITIES } from 'lib/store'
import merge from 'deepmerge'

const initialState = {
  entities: {}
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ENTITIES:
      if (action.entities.builds == null) return state
      return {
        ...state,
        entities: merge(state.entities, action.entities.builds)
      }

    default:
      return state
  }
}
