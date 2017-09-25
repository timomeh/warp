import { ADD_ENTITIES } from 'lib/store'

const initialState = {
  entities: {}
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ENTITIES:
      return {
        ...state,
        entities: {
          ...state.entities,
          ...action.entities.stages
        }
      }

    default:
      return state
  }
}
