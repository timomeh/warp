const API_URL = 'http://localhost:4000/api'

const api = {
  projects: {
    getAll() {
      return fetch(`${API_URL}/projects/`)
        .then(response => response.json())
    }
  }
}

export default api
