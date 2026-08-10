import { ref } from 'vue'
import { defineStore } from 'pinia'
import kitService from '@/services/kitService'
import { getApiErrorMessage } from '@/utils/apiError'

function listFromResponse(data) {
  return data?.results ?? (Array.isArray(data) ? data : [])
}

export const useKitStore = defineStore('kits', () => {
  const kits = ref([])
  const selectedKit = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchKits(params = {}) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await kitService.list({ page_size: 100, ...params })
      kits.value = listFromResponse(data)
      return kits.value
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar os kits.')
      kits.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchKit(slug) {
    loading.value = true
    error.value = ''
    selectedKit.value = null
    try {
      const { data } = await kitService.get(slug)
      selectedKit.value = data
      return data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar o kit.')
      throw err
    } finally {
      loading.value = false
    }
  }

  return { kits, selectedKit, loading, error, fetchKits, fetchKit }
})
