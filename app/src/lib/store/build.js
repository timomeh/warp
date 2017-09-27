import { normalize } from 'normalizr'
import { addEntities } from 'lib/store'

const REQUEST_BUILD = 'beam/project/REQUEST_BUILD'
const RECEIVE_BUILD = 'beam/project/RECEIVE_BUILD'

const initialState = {
  isFetching: true,
  selectedId: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_BUILD:
      return {
        ...state,
        isFetching: true
      }

    case RECEIVE_BUILD:
      return {
        ...state,
        isFetching: false,
        selectedId: action.id
      }

    default:
      return state
  }
}

export const requestBuild = () => ({
  type: REQUEST_BUILD
})

export const receiveBuild = id => ({
  type: RECEIVE_BUILD,
  id
})

export const fetchBuild = id => (dispatch, getState, { api, schema }) => {
  dispatch(requestBuild())

  return api.builds.getById(id)
    .then(response => {
      const { entities, result } = normalize(response.data, schema.build)
      dispatch(addEntities(entities))
      dispatch(receiveBuild(result))
    })
}
