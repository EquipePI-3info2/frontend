import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import addressService from '@/services/addressService'
import { getApiErrorMessage } from '@/utils/apiError'

export const useAddressStore = defineStore('addresses', () => {
  const addresses = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')

  const defaultAddress = computed(() => addresses.value.find((address) => address.is_default) || null)
  const hasAddresses = computed(() => addresses.value.length > 0)

  async function fetchAddresses() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await addressService.list()
      addresses.value = data.results ?? data
      return addresses.value
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar seus endereços.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createAddress(payload) {
    saving.value = true
    error.value = ''
    try {
      const { data } = await addressService.create(payload)
      await fetchAddresses()
      return data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível cadastrar o endereço.')
      throw err
    } finally {
      saving.value = false
    }
  }

  async function updateAddress(id, payload) {
    saving.value = true
    error.value = ''
    try {
      const { data } = await addressService.update(id, payload)
      await fetchAddresses()
      return data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível atualizar o endereço.')
      throw err
    } finally {
      saving.value = false
    }
  }

  async function deleteAddress(id) {
    saving.value = true
    error.value = ''
    try {
      await addressService.remove(id)
      await fetchAddresses()
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível excluir o endereço.')
      throw err
    } finally {
      saving.value = false
    }
  }

  return {
    addresses,
    loading,
    saving,
    error,
    defaultAddress,
    hasAddresses,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  }
})
