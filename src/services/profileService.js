/**
 * src/services/profileService.js
 *
 * Todas as chamadas de API relacionadas ao perfil do usuário autenticado.
 * Importa a instância Axios já configurada (base URL + interceptors de token).
 */
import api from '@/services/api'

const profileService = {
  /**
   * Retorna os dados do usuário autenticado.
   * GET /api/usuarios/me/
   */
  async getProfile() {
    const { data } = await api.get('/usuarios/me/')
    return data
  },

  /**
   * Atualiza nome e/ou telefone do usuário autenticado.
   * PATCH /api/usuarios/me/
   * @param {{ name?: string, telefone?: string }} payload
   */
  async updateProfile(payload) {
    const { data } = await api.patch('/usuarios/me/', payload)
    return data
  },

  /**
   * Envia nova foto de perfil (multipart/form-data).
   * PATCH /api/usuarios/me/foto/
   * @param {File} file
   */
  async uploadPhoto(file) {
    const formData = new FormData()
    formData.append('profile_photo', file)
    const { data } = await api.patch('/usuarios/me/foto/', formData)
    return data
  },

  /**
   * Remove a foto de perfil atual.
   * DELETE /api/usuarios/me/foto/
   */
  async removePhoto() {
    const { data } = await api.delete('/usuarios/me/foto/')
    return data
  },
}

export default profileService
