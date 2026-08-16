import api from './api'

const addressService = {
  list() {
    return api.get('/addresses/', { params: { page_size: 100 } })
  },
  get(id) {
    return api.get(`/addresses/${id}/`)
  },
  create(payload) {
    return api.post('/addresses/', payload)
  },
  update(id, payload) {
    return api.patch(`/addresses/${id}/`, payload)
  },
  remove(id) {
    return api.delete(`/addresses/${id}/`)
  },
}

export default addressService
