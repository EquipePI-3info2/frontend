import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import productService from '@/services/productService'

// Imagens locais de fallback (usadas quando o produto não tem imagem na API)
import cookieUrl  from '@/assets/images/cookie.png'
import brownieUrl from '@/assets/images/brownie.png'

/**
 * Retorna a URL final da imagem do produto.
 * - Se a API retornar image_url → usa ela
 * - Senão usa fallback por categoria
 */
export function resolveProductImage(product) {
  if (product?.image_url) return product.image_url
  const slug = product?.category?.slug || ''
  if (slug === 'brownies') return brownieUrl
  return cookieUrl // padrão para cookies e qualquer outra categoria
}

export const useProductStore = defineStore('products', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const products       = ref([])
  const categories     = ref([])
  const activeCategory = ref('')
  const loading        = ref(false)
  const loadingCats    = ref(false)
  const error          = ref(null)
  const pagination     = ref({ count: 0, next: null, previous: null })

  // ── Getters ────────────────────────────────────────────────────────────────
  const filteredProducts = computed(() => products.value)

  const hasProducts = computed(() => products.value.length > 0)

  // ── Actions ────────────────────────────────────────────────────────────────
  async function fetchCategories() {
    loadingCats.value = true
    try {
      const { data } = await productService.getCategories()
      // API retorna { results: [...] } com paginação ou array direto
      categories.value = data.results ?? data
      // Define categoria ativa como a primeira da lista (se não tiver uma)
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
    error.value   = null
    try {
      const params = {}
      const slug = categorySlug || activeCategory.value
      if (slug) params.category = slug

      const { data } = await productService.getProducts(params)
      const list = data.results ?? data
      pagination.value = {
        count:    data.count    ?? list.length,
        next:     data.next     ?? null,
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
    // state
    products, categories, activeCategory,
    loading, loadingCats, error, pagination,
    // getters
    filteredProducts, hasProducts,
    // actions
    fetchCategories, fetchProducts, setActiveCategory,
  }
})
