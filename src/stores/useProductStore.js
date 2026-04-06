import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '@/services/productService.js'

import cookieUrl  from '@/assets/images/cookie.png'
import brownieUrl from '@/assets/images/brownie.png'

const MOCK_CATEGORIES = [
  { id: 1, name: 'Cookies',  slug: 'cookies'  },
  { id: 2, name: 'Brownies', slug: 'brownies' },
]

const MOCK_PRODUCTS = [
  {
    id: 1, name: 'Cookie Clássico',
    description: 'Cookie artesanal com gotas de chocolate belga',
    price: '8.00',
    category: { id: 1, name: 'Cookies', slug: 'cookies' },
    image: null, stock: 20, is_active: true,
  },
  {
    id: 2, name: 'Cookie Red Velvet',
    description: 'Cookie red velvet artesanal com cream cheese',
    price: '10.00',
    category: { id: 1, name: 'Cookies', slug: 'cookies' },
    image: null, stock: 15, is_active: true,
  },
  {
    id: 3, name: 'Cookie Brigadeiro',
    description: 'Cookie recheado com brigadeiro artesanal',
    price: '11.00',
    category: { id: 1, name: 'Cookies', slug: 'cookies' },
    image: null, stock: 12, is_active: true,
  },
  {
    id: 4, name: 'Cookie Nutella',
    description: 'Cookie artesanal recheado com Nutella',
    price: '12.00',
    category: { id: 1, name: 'Cookies', slug: 'cookies' },
    image: null, stock: 10, is_active: true,
  },
  {
    id: 5, name: 'Brownie Clássico',
    description: 'Brownie artesanal de chocolate meio amargo',
    price: '12.00',
    category: { id: 2, name: 'Brownies', slug: 'brownies' },
    image: null, stock: 10, is_active: true,
  },
  {
    id: 6, name: 'Brownie Recheado',
    description: 'Brownie premium com recheio de chocolate branco',
    price: '14.00',
    category: { id: 2, name: 'Brownies', slug: 'brownies' },
    image: null, stock: 8, is_active: true,
  },
  {
    id: 7, name: 'Brownie Oreo',
    description: 'Brownie com pedaços de Oreo por dentro e por cima',
    price: '15.00',
    category: { id: 2, name: 'Brownies', slug: 'brownies' },
    image: null, stock: 6, is_active: true,
  },
  {
    id: 8, name: 'Brownie Ninho',
    description: 'Brownie de chocolate com recheio de leite Ninho',
    price: '15.00',
    category: { id: 2, name: 'Brownies', slug: 'brownies' },
    image: null, stock: 7, is_active: true,
  },
]

export function resolveProductImage(product) {
  if (product.image) return product.image
  const slug = product.category?.slug
  if (slug === 'cookies')  return cookieUrl
  if (slug === 'brownies') return brownieUrl
  return cookieUrl
}

export const useProductStore = defineStore('products', () => {
  const products       = ref([])
  const categories     = ref([])
  const activeCategory = ref('cookies')
  const loading        = ref(false)
  const error          = ref(null)

  const filteredProducts = computed(() =>
    products.value.filter(
      (p) => p.is_active && p.category?.slug === activeCategory.value
    )
  )

  async function fetchCategories() {
    try {
      const data = await productService.getCategories()
      categories.value = data
    } catch {
      categories.value = MOCK_CATEGORIES
    }
  }

  async function fetchProducts(categorySlug = null) {
    loading.value = true
    error.value   = null
    try {
      const data = await productService.getProducts(categorySlug)
      products.value = data
    } catch {
      products.value = MOCK_PRODUCTS
    } finally {
      loading.value = false
    }
  }

  function setActiveCategory(slug) {
    activeCategory.value = slug
  }

  return {
    products, categories, activeCategory, loading, error,
    filteredProducts,
    fetchCategories, fetchProducts, setActiveCategory,
  }
})
