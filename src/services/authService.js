import api from './api'

const authService = {
  login(email, password) {
    return api.post('/token/', { email, password })
  },
  register(userData) {
    return api.post('/registro/', userData)
  },
  refreshToken(refresh) {
    return api.post('/token/refresh/', { refresh })
  },
  getProfile() {
    return api.get('/usuarios/me/')
  },
  logout() {
    return api.post('/auth/logout/')
  },
}

export default authService
