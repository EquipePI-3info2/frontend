import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import productService from '@/services/productService'
import { getApiErrorMessage } from '@/utils/apiError'

import cookieUrl from '@/assets/images/cookie.png'
import brownieUrl from '@/assets/images/brownie.png'

export function resolveProductImage(product) {
  if (product?.image_url) return product.image_url
  if (product?.image) return product.image
  const slug = product?.category?.slug || product?.category_slug || ''
  return slug === 'brownies' ? brownieUrl : cookieUrl
}

export function resolveFallbackProductImage(product) {
  const slug = product?.category?.slug || product?.category_slug || ''
  return slug === 'brownies' ? brownieUrl : cookieUrl
}

function listFromResponse(data) {
  return data?.results ?? (Array.isArray(data) ? data : [])
}

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const selectedProduct = ref(null)
  const searchResults = ref([])
  const activeCategory = ref('')
  const loading = ref(false)
  const loadingCats = ref(false)
  const searchLoading = ref(false)
  const error = ref('')
  const searchError = ref('')
  const pagination = ref({ page: 1, pageSize: 10, totalPages: 1 })
  const searchPagination = ref({ page: 1, pageSize: 10, totalPages: 1 })

  const filteredProducts = computed(() => products.value)
  const hasProducts = computed(() => products.value.length > 0)

  function updatePagination(target, data, list) {
    target.value = {
      page: data?.page ?? 1,
      pageSize: data?.page_size ?? list.length,
      totalPages: data?.total_pages ?? 1,
    }
  }

  async function fetchCategories() {
    loadingCats.value = true
    try {
      const { data } = await productService.getCategories()
      categories.value = listFromResponse(data)
      return categories.value
    } catch (err) {
      console.error('[ProductStore] Erro ao carregar categorias:', err)
      return []
    } finally {
      loadingCats.value = false
    }
  }

  async function fetchProducts(categorySlug = activeCategory.value, extraParams = {}) {
    loading.value = true
    error.value = ''
    try {
      const params = { page_size: 100, ...extraParams }
      if (categorySlug) params.category = categorySlug
      const { data } = await productService.getProducts(params)
      const list = listFromResponse(data)
      products.value = list
      updatePagination(pagination, data, list)
      return list
    } catch (err) {
      error.value = getApiErrorMessage(err, 'Não foi possível carregar os produtos.')
      products.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(slug) {
    loading.value = true
    error.value = ''
    selectedProduct.value = null
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

  async function searchProducts(params = {}) {
    searchLoading.value = true
    searchError.value = ''
    try {
      const cleanParams = Object.fromEntries(
        Object.entries({ page_size: 100, ...params }).filter(([, value]) => value !== '' && value != null),
      )
      const { data } = await productService.getProducts(cleanParams)
      const list = listFromResponse(data)
      searchResults.value = list
      updatePagination(searchPagination, data, list)
      return list
    } catch (err) {
      searchError.value = getApiErrorMessage(err, 'Não foi possível realizar a busca.')
      searchResults.value = []
      throw err
    } finally {
      searchLoading.value = false
    }
  }

  async function setActiveCategory(slug) {
    activeCategory.value = slug || ''
    await fetchProducts(activeCategory.value)
  }

  return {
    products,
    categories,
    selectedProduct,
    searchResults,
    activeCategory,
    loading,
    loadingCats,
    searchLoading,
    error,
    searchError,
    pagination,
    searchPagination,
    filteredProducts,
    hasProducts,
    fetchCategories,
    fetchProducts,
    fetchProduct,
    searchProducts,
    setActiveCategory,
  }
})
