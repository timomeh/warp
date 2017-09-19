import { normalize } from 'normalizr'
import { addEntities, ADD_ENTITIES } from 'lib/store'

const SELECT_PROJECT = 'beam/projects/SELECT_PROJECT'
const REQUEST_PROJECTS = 'beam/projects/REQUEST_PROJECTS'
const RECEIVE_PROJECTS = 'beam/projects/RECEIVE_PROJECTS'

const initialState = {
  selected: -1,
  isFetching: false,
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

    case SELECT_PROJECT:
      return {
        ...state,
        selected: action.project.id
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

export const selectProject = project => ({
  type: SELECT_PROJECT,
  project
})

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
      const { entities, result } = normalize(response.data, [ schema.project ])
      dispatch(addEntities(entities))
      dispatch(receiveProjects(result))
    })
}
