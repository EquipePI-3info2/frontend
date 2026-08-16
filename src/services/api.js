import axios from 'axios'

const fallbackBaseURL = import.meta.env.DEV ? '/api' : 'https://backend-znt0.onrender.com/api'
const baseURL = String(import.meta.env.VITE_API_URL || fallbackBaseURL).replace(/\/$/, '')

const api = axios.create({
  baseURL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)))
  failedQueue = []
}

function clearSessionAndRedirect() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')

  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    const redirect = `${window.location.pathname}${window.location.search}`
    window.location.assign(`/login?redirect=${encodeURIComponent(redirect)}`)
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const url = String(original?.url || '')
    const isAuthenticationRequest =
      url.includes('/token/') || url.includes('/registro/')

    if (error.response?.status !== 401 || original?._retry || isAuthenticationRequest) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const refresh = localStorage.getItem('refresh_token')
      if (!refresh) throw new Error('Refresh token não encontrado.')

      const { data } = await axios.post(`${baseURL}/token/refresh/`, { refresh })
      localStorage.setItem('access_token', data.access)
      api.defaults.headers.common.Authorization = `Bearer ${data.access}`
      processQueue(null, data.access)
      original.headers.Authorization = `Bearer ${data.access}`
      return api(original)
    } catch (refreshError) {
      processQueue(refreshError)
      clearSessionAndRedirect()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
