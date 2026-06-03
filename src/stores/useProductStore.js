import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import productService from '@/services/productService'

import cookieUrl  from '@/assets/images/cookie.png'
import brownieUrl from '@/assets/images/brownie.png'

export function resolveProductImage(product) {
  if (product?.image_url) return product.image_url
  const slug = product?.category?.slug || ''
  if (slug === 'brownies') return brownieUrl
  return cookieUrl
}

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const activeCategory = ref('')
  const loading = ref(false)
  const loadingCats = ref(false)
  const error = ref(null)
  const pagination = ref({ count: 0, next: null, previous: null })
  const filteredProducts = computed(() => products.value)

  const hasProducts = computed(() => products.value.length > 0)
  async function fetchCategories() {
    loadingCats.value = true
    try {
      const { data } = await productService.getCategories()
      categories.value = data.results ?? data
      if (!activeCategory.value && categories.value.length > 0) {
        activeCategory.value = categories.value[0].slug
      }
    } catch (err) {
      console.error('[ProductStore] Erro ao carregar categorias:', err)
    } finally {
      loadingCats.value = false
    }
  }

  async function fetchProducts(categorySlug = null) {
    loading.value = true
    error.value = null
    try {
      const params = {}
      const slug = categorySlug || activeCategory.value
      if (slug) params.category = slug

      const { data } = await productService.getProducts(params)
      const list = data.results ?? data
      pagination.value = {
        count: data.count ?? list.length,
        next: data.next ?? null,
        previous: data.previous ?? null,
      }
      products.value = list
    } catch (err) {
      error.value = 'Não foi possível carregar os produtos. Tente novamente.'
      console.error('[ProductStore] Erro ao carregar produtos:', err)
      products.value = []
    } finally {
      loading.value = false
    }
  }

  function setActiveCategory(slug) {
    if (activeCategory.value === slug) return
    activeCategory.value = slug
    fetchProducts(slug)
  }

  return {
    products,
    categories,
    activeCategory,
    loading,
    loadingCats,
    error,
    pagination,
    filteredProducts,
    hasProducts,
    fetchCategories,
    fetchProducts,
    setActiveCategory,
  }
})
