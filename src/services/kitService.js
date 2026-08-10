import api from './api'

const kitService = {
  list(params = {}) {
    return api.get('/kits/', { params })
  },
  get(slug) {
    return api.get(`/kits/${slug}/`)
  },
  create(payload) {
    return api.post('/kits/', payload)
  },
  update(slug, payload) {
    return api.patch(`/kits/${slug}/`, payload)
  },
  delete(slug) {
    return api.delete(`/kits/${slug}/`)
  },
}

export default kitService
