import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'
import profileService from '@/services/profileService'

export const useAuthStore = defineStore('auth', () => {
  const user    = ref(null)
  const token   = ref(localStorage.getItem('access_token') || null)
  const loading = ref(false)
  const error   = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin         = computed(() => user.value?.is_staff === true)

  // ── Login ────────────────────────────────────────────────────────────────
  async function login(email, password) {
    loading.value = true
    error.value   = null
    try {
      const { data } = await authService.login(email, password)
      token.value = data.access
      localStorage.setItem('access_token',  data.access)
      localStorage.setItem('refresh_token', data.refresh)
      await fetchProfile()
    } catch (err) {
      // Mensagem amigável para credenciais inválidas (401) ou outros erros
      error.value = err.response?.status === 401
        ? 'E-mail ou senha incorretos.'
        : 'Erro ao entrar. Tente novamente.'
      throw err   // propaga para o componente poder reagir se necessário
    } finally {
      loading.value = false
    }
  }

  // ── Cadastro ─────────────────────────────────────────────────────────────
  async function register(userData) {
    loading.value = true
    error.value   = null
    try {
      await authService.register(userData)
    } catch (err) {
      error.value = 'Erro ao cadastrar. Verifique os dados e tente novamente.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── Recuperar perfil ─────────────────────────────────────────────────────
  async function fetchProfile() {
    try {
      const { data } = await authService.getProfile()
      user.value = data
    } catch {
      // Se falhar (token inválido/expirado), limpa a sessão
      logout()
    }
  }

  // ── Atualizar nome/telefone ────────────────────────────────────────────────
  async function updateProfile(payload) {
    error.value = null
    try {
      const updatedUser = await profileService.updateProfile(payload)
      user.value = updatedUser
      return updatedUser
    } catch (err) {
      error.value = 'Erro ao atualizar perfil. Tente novamente.'
      throw err
    }
  }

  // ── Upload de foto de perfil ────────────────────────────────────────────────
  async function uploadPhoto(file) {
    error.value = null
    try {
      const updatedUser = await profileService.uploadPhoto(file)
      user.value = updatedUser
      return updatedUser
    } catch (err) {
      error.value = 'Erro ao enviar a foto. Tente novamente.'
      throw err
    }
  }

  // ── Remover foto de perfil ──────────────────────────────────────────────────
  async function removePhoto() {
    error.value = null
    try {
      const updatedUser = await profileService.removePhoto()
      user.value = updatedUser
      return updatedUser
    } catch (err) {
      error.value = 'Erro ao remover a foto. Tente novamente.'
      throw err
    }
  }

  // ── Inicialização (chamado no App.vue ao montar) ──────────────────────────
  // Garante que, após um F5, o user é recarregado se o token ainda for válido.
  async function init() {
    if (token.value && !user.value) {
      await fetchProfile()
    }
  }

  // ── Logout — apenas frontend (backend não possui endpoint de logout) ──────
  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    user, token, loading, error,
    isAuthenticated, isAdmin,
    login, register, fetchProfile, updateProfile, uploadPhoto, removePhoto, init, logout,
  }
})
