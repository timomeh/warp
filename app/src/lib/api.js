const API_URL = 'http://localhost:4000/api'

const api = {
  projects: {
    getAll() {
      return fetch(`${API_URL}/projects/`)
        .then(response => response.json())
    },
    getById(id) {
      return fetch(`${API_URL}/projects/${id}`)
        .then(response => response.json())
    },
    getBuildHistory(id) {
      return fetch(`${API_URL}/projects/${id}/builds`)
        .then(response => response.json())
    }
  },
  builds: {
    getById(id) {
      return fetch(`${API_URL}/builds/${id}`)
        .then(response => response.json())
    }
  }
}

export default api
