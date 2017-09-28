import { normalize } from 'normalizr'
import { addEntities, ADD_ENTITIES } from 'lib/store'

const REQUEST_PROJECTS = 'warp/projects/REQUEST_PROJECTS'
const RECEIVE_PROJECTS = 'warp/projects/RECEIVE_PROJECTS'

const initialState = {
  isFetching: true,
  items: [],
  entities: {}
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ENTITIES:
      return {
        ...state,
        entities: {
          ...state.entities,
          ...action.entities.projects
        }
      }

    case REQUEST_PROJECTS:
      return {
        ...state,
        isFetching: true
      }

    case RECEIVE_PROJECTS:
      return {
        ...state,
        isFetching: false,
        items: action.items
      }

    default:
      return state
  }
}

export const requestProjects = () => ({
  type: REQUEST_PROJECTS
})

export const receiveProjects = items => ({
  type: RECEIVE_PROJECTS,
  items
})

export const fetchProjects = () => (dispatch, getState, { api, schema }) => {
  dispatch(requestProjects())
  return api.projects.getAll()
    .then(response => {
      const { entities, result } = normalize(response.data, [schema.project])
      dispatch(addEntities(entities))
      dispatch(receiveProjects(result))
      return result
    })
}
