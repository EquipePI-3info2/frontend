import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user            = ref(null)
  const token           = ref(localStorage.getItem('access_token') || null)
  const loading         = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin         = computed(() => user.value?.is_staff === true)

  async function login(email, password) {
    loading.value = true
    try {
      const { data } = await authService.login(email, password)
      token.value = data.access
      localStorage.setItem('access_token',  data.access)
      localStorage.setItem('refresh_token', data.refresh)
      await fetchProfile()
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    try {
      await authService.register(userData)
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    try {
      const { data } = await authService.getProfile()
      user.value = data
    } catch { /* silencioso */ }
  }

  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    user, token, loading,
    isAuthenticated, isAdmin,
    login, register, fetchProfile, logout,
  }
})
