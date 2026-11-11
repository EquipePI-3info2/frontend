import api from './api'

export default {
  get(period) {
    return api.get('/admin/dashboard/', { params: { period } })
  },
}
