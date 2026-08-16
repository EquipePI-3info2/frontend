import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '@/services/authService'
import profileService from '@/services/profileService'
import { getApiErrorMessage } from '@/utils/apiError'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('access_token') || null)
  const loading = ref(false)
  const initialized = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => Boolean(token.value))
  const isAdmin = computed(() => user.value?.is_staff === true)

  async function login(email, password) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await authService.login(email, password)
      token.value = data.access
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      await fetchProfile()
      return user.value
    } catch (err) {
      if (err.response?.status === 401) {
        error.value = 'E-mail ou senha incorretos.'
      } else {
        error.value = getApiErrorMessage(err, 'Erro ao entrar. Tente novamente.')
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await authService.register(userData)
      return data
    } catch (err) {
      error.value = getApiErrorMessage(
        err,
        'Erro ao cadastrar. Verifique os dados e tente novamente.',
      )
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    try {
      const { data } = await authService.getProfile()
      user.value = data
      return data
    } catch (err) {
      if (err.response?.status === 401) logout()
      throw err
    }
  }

  async function updateProfile(payload) {
    error.value = ''
    try {
      const updatedUser = await profileService.updateProfile(payload)
      user.value = updatedUser
      return updatedUser
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Erro ao atualizar perfil. Tente novamente.')
      throw err
    }
  }

  async function uploadPhoto(file) {
    error.value = ''
    try {
      const updatedUser = await profileService.uploadPhoto(file)
      user.value = updatedUser
      return updatedUser
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Erro ao enviar a foto. Tente novamente.')
      throw err
    }
  }

  async function removePhoto() {
    error.value = ''
    try {
      const updatedUser = await profileService.removePhoto()
      user.value = updatedUser
      return updatedUser
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Erro ao remover a foto. Tente novamente.')
      throw err
    }
  }

  async function init() {
    if (initialized.value) return user.value
    try {
      if (token.value && !user.value) await fetchProfile()
    } catch (err) {
      if (err.response?.status !== 401) {
        console.warn('[AuthStore] Não foi possível atualizar o perfil:', err)
      }
    } finally {
      initialized.value = true
    }
    return user.value
  }

  function clearError() {
    error.value = ''
  }

  function logout() {
    user.value = null
    token.value = null
    initialized.value = true
    error.value = ''
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    user,
    token,
    loading,
    initialized,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    fetchProfile,
    updateProfile,
    uploadPhoto,
    removePhoto,
    init,
    clearError,
    logout,
  }
})
