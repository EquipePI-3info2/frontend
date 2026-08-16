import api from './api'

const paymentService = {
  list(params = {}) {
    return api.get('/payments/', { params })
  },
  get(id) {
    return api.get(`/payments/${id}/`)
  },
  updateStatus(id, payload) {
    return api.patch(`/payments/${id}/`, payload)
  },
}

export default paymentService
