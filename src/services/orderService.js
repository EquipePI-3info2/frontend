import api from './api'

const orderService = {
  list(params = {}) {
    return api.get('/orders/', { params })
  },
  listMine(params = {}) {
    return api.get('/orders/me/', { params })
  },
  latest() {
    return api.get('/orders/latest/')
  },
  get(id) {
    return api.get(`/orders/${id}/`)
  },
  create(payload) {
    return api.post('/orders/', payload)
  },
  cancel(id) {
    return api.post(`/orders/${id}/cancel/`)
  },
  updateStatus(id, status) {
    return api.patch(`/orders/${id}/`, { status })
  },
}

export default orderService
