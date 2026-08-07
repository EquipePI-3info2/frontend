import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import productService from '@/services/productService'

const STORAGE_KEY = 'brookie_cart_v1'

function readStoredCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item?.product?.id && Number(item.quantity) > 0)
      .map((item) => ({
        product: item.product,
        quantity: Math.max(1, Number(item.quantity) || 1),
      }))
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function availableStock(product) {
  const stock = Number(product?.stock ?? 0)
  return Number.isFinite(stock) ? Math.max(0, stock) : 0
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(readStoredCart())

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() =>
    items.value.reduce(
      (sum, item) => sum + Number(item.product?.price || 0) * item.quantity,
      0,
    ),
  )
  const isEmpty = computed(() => items.value.length === 0)
  const hasUnavailableItems = computed(() =>
    items.value.some(
      ({ product, quantity }) =>
        product?.is_active === false || !product?.is_in_stock || quantity > availableStock(product),
    ),
  )
  const canCheckout = computed(() => !isEmpty.value && !hasUnavailableItems.value)
  const isInCart = computed(
    () => (productId) => items.value.some((item) => item.product.id === productId),
  )

  watch(
    items,
    (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)),
    { deep: true },
  )

  function addToCart(product, quantity = 1) {
    if (!product?.id || product.is_active === false || !product.is_in_stock) {
      return { ok: false, message: 'Este produto não está disponível no momento.' }
    }

    const stock = availableStock(product)
    const desired = Math.max(1, Number(quantity) || 1)
    const existing = items.value.find((item) => item.product.id === product.id)
    const currentQuantity = existing?.quantity || 0
    const nextQuantity = Math.min(currentQuantity + desired, stock)

    if (nextQuantity <= currentQuantity) {
      return { ok: false, message: `Quantidade máxima disponível: ${stock}.` }
    }

    if (existing) {
      existing.product = { ...existing.product, ...product }
      existing.quantity = nextQuantity
    } else {
      items.value.push({ product: { ...product }, quantity: Math.min(desired, stock) })
    }

    return {
      ok: true,
      quantity: nextQuantity,
      limited: currentQuantity + desired > stock,
      message: currentQuantity + desired > stock ? `Quantidade ajustada ao estoque disponível (${stock}).` : '',
    }
  }

  function removeFromCart(productId) {
    items.value = items.value.filter((item) => item.product.id !== productId)
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find((entry) => entry.product.id === productId)
    if (!item) return { ok: false }

    const desired = Number(quantity)
    if (desired <= 0) {
      removeFromCart(productId)
      return { ok: true, removed: true }
    }

    const stock = availableStock(item.product)
    if (stock <= 0 || item.product.is_active === false || !item.product.is_in_stock) {
      return { ok: false, message: 'Este produto não está disponível no momento.' }
    }
    item.quantity = Math.min(Math.max(1, desired), stock)
    return {
      ok: true,
      quantity: item.quantity,
      limited: desired > stock,
      message: desired > stock ? `Quantidade máxima disponível: ${stock}.` : '',
    }
  }

  function syncProduct(product) {
    const item = items.value.find((entry) => entry.product.id === product?.id)
    if (!item) return

    item.product = { ...item.product, ...product }
    const stock = availableStock(item.product)
    if (stock === 0 || item.product.is_active === false || !item.product.is_in_stock) return
    if (item.quantity > stock) item.quantity = stock
  }

  function removeUnavailableItems() {
    items.value = items.value.filter(
      ({ product }) => product?.is_active !== false && product?.is_in_stock && availableStock(product) > 0,
    )
    items.value.forEach((item) => {
      item.quantity = Math.min(item.quantity, availableStock(item.product))
    })
  }

  function clearCart() {
    items.value = []
  }

  async function refreshProducts() {
    const results = await Promise.allSettled(
      items.value.map(({ product }) => productService.getProduct(product.slug)),
    )

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        syncProduct(result.value.data)
        return
      }

      const item = items.value[index]
      if (item) {
        item.product = {
          ...item.product,
          is_active: false,
          is_in_stock: false,
        }
      }
    })

    return {
      ok: canCheckout.value,
      unavailable: hasUnavailableItems.value,
    }
  }

  return {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    hasUnavailableItems,
    canCheckout,
    isInCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    syncProduct,
    removeUnavailableItems,
    refreshProducts,
    clearCart,
  }
})
