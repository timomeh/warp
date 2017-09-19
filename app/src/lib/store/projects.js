import { normalize } from 'normalizr'

const SELECT_PROJECT = 'beam/projects/SELECT_PROJECT'
const REQUEST_PROJECTS = 'beam/projects/REQUEST_PROJECTS'
const RECEIVE_PROJECTS = 'beam/projects/RECEIVE_PROJECTS'

const initialState = {
  selected: -1,
  isFetching: false,
  items: {}
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
        items: action.projects
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

export const receiveProjects = projects => ({
  type: RECEIVE_PROJECTS,
  projects
})

export const fetchProjects = () => (dispatch, getState, { api, schema }) => {
  dispatch(requestProjects())
  return api.projects.getAll()
    .then(response => {
      const projects = normalize(response.data, schema.projectList)
      dispatch(receiveProjects(projects))
    })
}
