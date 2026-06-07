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
  // NOTA: o backend não possui endpoint de logout.
  // O logout é feito apenas no frontend (limpeza de tokens no localStorage).
  // O método abaixo foi removido intencionalmente.
}

export default authService
