import { normalize } from 'normalizr'
import { addEntities } from 'lib/store'

const REQUEST_PROJECT = 'beam/project/REQUEST_PROJECTS'
const RECEIVE_PROJECT = 'beam/project/RECEIVE_PROJECTS'
const REQUEST_BUILDS = 'beam/project/REQUEST_BUILDS'
const RECEIVE_BUILDS = 'beam/project/RECEIVE_BUILDS'

const initialState = {
  isFetching: true,
  selectedId: null,
  isFetchingBuilds: false,
  buildHistory: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PROJECT:
      return {
        ...state,
        isFetching: true
      }

    case RECEIVE_PROJECT:
      return {
        ...state,
        isFetching: false,
        selectedId: action.id
      }

    case REQUEST_BUILDS:
      return {
        ...state,
        isFetchingBuilds: true
      }

    case RECEIVE_BUILDS:
      return {
        ...state,
        isFetchingBuilds: false,
        buildHistory: action.ids
      }

    default:
      return state
  }
}

export const requestProject = () => ({
  type: REQUEST_PROJECT
})

export const receiveProject = id => ({
  type: RECEIVE_PROJECT,
  id
})

export const requestBuildHistory = () => ({
  type: REQUEST_BUILDS
})

export const receiveBuildHistory = ids => ({
  type: RECEIVE_BUILDS,
  ids
})

export const selectProject = state => state.project.selectedId

export const fetchProject = id => (dispatch, getState, { api, schema }) => {
  dispatch(requestProject())

  return api.projects.getById(id)
    .then(response => {
      const { entities, result } = normalize(response.data, schema.project)
      dispatch(addEntities(entities))
      dispatch(receiveProject(result))
    })
}

export const updateProject = id => (dispatch, getState, { api, schema }) => {
  const projectId = id || selectProject(getState())

  return api.projects.getById(projectId)
    .then(response => {
      const { entities } = normalize(response.data, schema.project)
      dispatch(addEntities(entities))
    })
}

export const fetchBuildHistory = projectId => (dispatch, getState, { api, schema }) => {
  const id = projectId || selectProject(getState())
  dispatch(requestBuildHistory())

  return api.projects.getBuildHistory(id)
    .then(response => {
      const { entities, result } = normalize(response.data, [schema.build])
      dispatch(addEntities(entities))
      dispatch(receiveBuildHistory(result))
    })
}
