import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import productService from '@/services/productService'
import kitService from '@/services/kitService'
import orderService from '@/services/orderService'
import paymentService from '@/services/paymentService'
import { getApiErrorMessage } from '@/utils/apiError'

function listFromResponse(data) {
  return data?.results ?? (Array.isArray(data) ? data : [])
}

export const useAdminStore = defineStore('admin', () => {
  const products = ref([])
  const categories = ref([])
  const flavors = ref([])
  const kits = ref([])
  const orders = ref([])
  const payments = ref([])
  const selectedProduct = ref(null)
  const selectedKit = ref(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')

  const stats = computed(() => ({
    products: products.value.length,
    kits: kits.value.length,
    activeKits: kits.value.filter((item) => item.is_active).length,
    activeProducts: products.value.filter((item) => item.is_active).length,
    outOfStock: products.value.filter((item) => Number(item.stock || 0) === 0).length,
    pendingOrders: orders.value.filter((item) => item.status === 'pending').length,
    pendingPayments: payments.value.filter((item) => item.status === 'pending').length,
  }))

  const recentOrders = computed(() => orders.value.slice(0, 5))

  async function fetchCatalog() {
    loading.value = true
    error.value = ''
    try {
      const [productsResponse, categoriesResponse, flavorsResponse] = await Promise.all([
        productService.getProducts({ page_size: 100, ordering: 'name' }),
        productService.getCategories({ page_size: 100, ordering: 'order' }),
        productService.getFlavors({ page_size: 100, ordering: 'name' }),
      ])
      products.value = listFromResponse(productsResponse.data)
      categories.value = listFromResponse(categoriesResponse.data)
      flavors.value = listFromResponse(flavorsResponse.data)
      return { products: products.value, categories: categories.value, flavors: flavors.value }
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar o catálogo administrativo.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDashboard() {
    loading.value = true
    error.value = ''
    try {
      const [productsResponse, categoriesResponse, flavorsResponse, kitsResponse, ordersResponse, paymentsResponse] = await Promise.all([
        productService.getProducts({ page_size: 100 }),
        productService.getCategories({ page_size: 100 }),
        productService.getFlavors({ page_size: 100 }),
        kitService.list({ page_size: 100 }),
        orderService.list({ page_size: 100 }),
        paymentService.list({ page_size: 100 }),
      ])
      products.value = listFromResponse(productsResponse.data)
      categories.value = listFromResponse(categoriesResponse.data)
      flavors.value = listFromResponse(flavorsResponse.data)
      kits.value = listFromResponse(kitsResponse.data)
      orders.value = listFromResponse(ordersResponse.data)
      payments.value = listFromResponse(paymentsResponse.data)
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar o painel administrativo.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(slug) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await productService.getProduct(slug)
      selectedProduct.value = data
      return data
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar o produto.')
      throw err
    } finally {
      loading.value = false
    }
  }


  async function fetchKits() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await kitService.list({ page_size: 100, ordering: 'name' })
      kits.value = listFromResponse(data)
      return kits.value
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar os kits.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchKit(slug) {
    loading.value = true
    error.value = ''
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

  async function createKit(payload) {
    return save(() => kitService.create(payload), 'Não foi possível criar o kit.')
  }

  async function updateKit(slug, payload) {
    return save(() => kitService.update(slug, payload), 'Não foi possível atualizar o kit.')
  }

  async function deleteKit(slug) {
    return save(() => kitService.delete(slug), 'Não foi possível excluir o kit.')
  }

  async function createProduct(payload) {
    return save(() => productService.createProduct(payload), 'Não foi possível criar o produto.')
  }

  async function updateProduct(slug, payload) {
    return save(() => productService.updateProduct(slug, payload), 'Não foi possível atualizar o produto.')
  }

  async function deleteProduct(slug) {
    return save(() => productService.deleteProduct(slug), 'Não foi possível excluir o produto.')
  }

  async function createCategory(payload) {
    return save(() => productService.createCategory(payload), 'Não foi possível criar a categoria.')
  }

  async function updateCategory(slug, payload) {
    return save(() => productService.updateCategory(slug, payload), 'Não foi possível atualizar a categoria.')
  }

  async function deleteCategory(slug) {
    return save(() => productService.deleteCategory(slug), 'Não foi possível excluir a categoria.')
  }

  async function createFlavor(payload) {
    return save(() => productService.createFlavor(payload), 'Não foi possível criar o sabor.')
  }

  async function updateFlavor(slug, payload) {
    return save(() => productService.updateFlavor(slug, payload), 'Não foi possível atualizar o sabor.')
  }

  async function deleteFlavor(slug) {
    return save(() => productService.deleteFlavor(slug), 'Não foi possível excluir o sabor.')
  }

  async function save(action, fallbackMessage) {
    saving.value = true
    error.value = ''
    try {
      const response = await action()
      return response?.data ?? null
    } catch (err) {
      error.value = getApiErrorMessage(err, fallbackMessage)
      throw err
    } finally {
      saving.value = false
    }
  }

  function clearError() {
    error.value = ''
  }

  return {
    products,
    categories,
    flavors,
    kits,
    orders,
    payments,
    selectedProduct,
    selectedKit,
    loading,
    saving,
    error,
    stats,
    recentOrders,
    fetchCatalog,
    fetchDashboard,
    fetchProduct,
    fetchKits,
    fetchKit,
    createKit,
    updateKit,
    deleteKit,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
    createFlavor,
    updateFlavor,
    deleteFlavor,
    clearError,
  }
})
