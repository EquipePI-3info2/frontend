import api from './api.js'

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login/', credentials)
    return data
  },
  async register(userData) {
    const { data } = await api.post('/auth/register/', userData)
    return data
  },
  async logout() {
    await api.post('/auth/logout/')
  },
  async getProfile() {
    const { data } = await api.get('/auth/me/')
    return data
  },
  async refreshToken(refresh) {
    const { data } = await api.post('/auth/token/refresh/', { refresh })
    return data
  },
}
