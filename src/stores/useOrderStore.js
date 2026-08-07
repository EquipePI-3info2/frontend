import { ref } from 'vue'
import { defineStore } from 'pinia'
import orderService from '@/services/orderService'
import paymentService from '@/services/paymentService'
import { getApiErrorMessage } from '@/utils/apiError'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref([])
  const payments = ref([])
  const currentOrder = ref(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')

  async function fetchMyOrders(params = {}) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await orderService.listMine({ page_size: 100, ...params })
      orders.value = data.results ?? data
      return orders.value
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar seus pedidos.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAllOrders(params = {}) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await orderService.list({ page_size: 100, ...params })
      orders.value = data.results ?? data
      return orders.value
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar os pedidos.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchOrder(id) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await orderService.get(id)
      currentOrder.value = data
      return data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar o pedido.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createOrder(payload) {
    saving.value = true
    error.value = ''
    try {
      const { data } = await orderService.create(payload)
      currentOrder.value = data
      orders.value.unshift(data)
      return data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível finalizar o pedido.')
      throw err
    } finally {
      saving.value = false
    }
  }

  async function cancelOrder(id) {
    saving.value = true
    error.value = ''
    try {
      const { data } = await orderService.cancel(id)
      replaceOrder(data)
      return data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível cancelar o pedido.')
      throw err
    } finally {
      saving.value = false
    }
  }

  async function updateOrderStatus(id, status) {
    saving.value = true
    error.value = ''
    try {
      const { data } = await orderService.updateStatus(id, status)
      replaceOrder(data)
      return data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível atualizar o pedido.')
      throw err
    } finally {
      saving.value = false
    }
  }

  async function fetchPayments(params = {}) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await paymentService.list({ page_size: 100, ...params })
      payments.value = data.results ?? data
      return payments.value
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar os pagamentos.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePaymentStatus(id, payload) {
    saving.value = true
    error.value = ''
    try {
      const { data } = await paymentService.updateStatus(id, payload)
      const index = payments.value.findIndex((payment) => payment.id === data.id)
      if (index >= 0) payments.value[index] = data
      if (currentOrder.value?.payment?.id === data.id) {
        await fetchOrder(currentOrder.value.id)
      }
      return data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível atualizar o pagamento.')
      throw err
    } finally {
      saving.value = false
    }
  }

  function replaceOrder(order) {
    const index = orders.value.findIndex((item) => item.id === order.id)
    if (index >= 0) orders.value[index] = order
    if (currentOrder.value?.id === order.id) currentOrder.value = order
  }

  function clearCurrentOrder() {
    currentOrder.value = null
  }

  return {
    orders,
    payments,
    currentOrder,
    loading,
    saving,
    error,
    fetchMyOrders,
    fetchAllOrders,
    fetchOrder,
    createOrder,
    cancelOrder,
    updateOrderStatus,
    fetchPayments,
    updatePaymentStatus,
    clearCurrentOrder,
  }
})
