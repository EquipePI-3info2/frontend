import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService.js'

export const useAuthStore = defineStore('auth', () => {
  const user         = ref(null)
  const token        = ref(null)
  const refreshToken = ref(null)
  const loading      = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin         = computed(() => user.value?.is_staff === true)

  async function login(email, password) {
    loading.value = true
    try {
      const data = await authService.login({ email, password })
      token.value        = data.access
      refreshToken.value = data.refresh
      user.value         = data.user ?? null
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    try {
      const data = await authService.register(userData)
      token.value        = data.access
      refreshToken.value = data.refresh
      user.value         = data.user ?? null
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      user.value = await authService.getProfile()
    } catch {
      logout()
    }
  }

  async function doRefreshToken() {
    if (!refreshToken.value) throw new Error('No refresh token')
    const data  = await authService.refreshToken(refreshToken.value)
    token.value = data.access
  }

  function logout() {
    user.value = null; token.value = null; refreshToken.value = null
  }

  return {
    user, token, refreshToken, loading,
    isAuthenticated, isAdmin,
    login, register, fetchProfile, doRefreshToken, logout,
  }
})
