import { normalize } from 'normalizr'
import { addEntities, ADD_ENTITIES } from 'lib/store'
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

export const fetchBuild = id => (dispatch, getState, { api, schema }) => {
  return api.builds.getById(id)
    .then(response => {
      const { entities } = normalize(response.data, schema.build)
      dispatch(addEntities(entities))
    })
}
