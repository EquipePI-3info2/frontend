import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import kitService from '@/services/kitService'
import productService from '@/services/productService'

const STORAGE_KEY = 'brookie_cart_v1'

function normalizeProductLines(lines) {
  if (!Array.isArray(lines)) return []
  return lines
    .filter((item) => item?.product?.id && Number(item.quantity) > 0)
    .map((item) => ({
      product: item.product,
      quantity: Math.max(1, Number(item.quantity) || 1),
    }))
}

function normalizeKitLines(lines) {
  if (!Array.isArray(lines)) return []
  return lines
    .filter((item) => item?.kit?.id && Number(item.quantity) > 0)
    .map((item) => ({
      kit: item.kit,
      quantity: Math.max(1, Number(item.quantity) || 1),
    }))
}

function readStoredCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (Array.isArray(parsed)) {
      return { products: normalizeProductLines(parsed), kits: [] }
    }
    return {
      products: normalizeProductLines(parsed?.products),
      kits: normalizeKitLines(parsed?.kits),
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return { products: [], kits: [] }
  }
}

function availableStock(product) {
  const stock = Number(product?.stock ?? 0)
  return Number.isFinite(stock) ? Math.max(0, stock) : 0
}

function availableKitStock(kit) {
  const stock = Number(kit?.available_stock ?? 0)
  return Number.isFinite(stock) ? Math.max(0, stock) : 0
}

function productStockMessage(stock) {
  return stock === 1
    ? 'Só temos 1 unidade deste produto disponível no momento.'
    : `Só temos ${stock} unidades deste produto disponíveis no momento.`
}

function kitStockMessage() {
  return 'Este kit não está disponível na quantidade selecionada no momento.'
}

export const useCartStore = defineStore('cart', () => {
  const stored = readStoredCart()
  const items = ref(stored.products)
  const kitItems = ref(stored.kits)

  const totalItems = computed(
    () =>
      items.value.reduce((sum, item) => sum + item.quantity, 0)
      + kitItems.value.reduce((sum, item) => sum + item.quantity, 0),
  )
  const totalPrice = computed(
    () =>
      items.value.reduce(
        (sum, item) => sum + Number(item.product?.price || 0) * item.quantity,
        0,
      )
      + kitItems.value.reduce(
        (sum, item) => sum + Number(item.kit?.promotional_price || 0) * item.quantity,
        0,
      ),
  )
  const isEmpty = computed(() => items.value.length === 0 && kitItems.value.length === 0)
  const sharedStockExceeded = computed(() => {
    const required = new Map()
    const stocks = new Map()

    items.value.forEach(({ product, quantity }) => {
      required.set(product.id, (required.get(product.id) || 0) + quantity)
      stocks.set(product.id, availableStock(product))
    })

    kitItems.value.forEach(({ kit, quantity }) => {
      ;(kit.items || []).forEach((component) => {
        const product = component.product
        if (!product?.id) return
        required.set(
          product.id,
          (required.get(product.id) || 0) + Number(component.quantity || 0) * quantity,
        )
        stocks.set(product.id, availableStock(product))
      })
    })

    return [...required.entries()].some(
      ([productId, quantity]) => quantity > (stocks.get(productId) ?? 0),
    )
  })
  const hasUnavailableItems = computed(
    () =>
      items.value.some(
        ({ product, quantity }) =>
          product?.is_active === false
          || !product?.is_in_stock
          || quantity > availableStock(product),
      )
      || kitItems.value.some(
        ({ kit, quantity }) =>
          kit?.is_active === false
          || !kit?.is_in_stock
          || quantity > availableKitStock(kit),
      )
      || sharedStockExceeded.value,
  )
  const canCheckout = computed(() => !isEmpty.value && !hasUnavailableItems.value)
  const isInCart = computed(
    () => (productId) => items.value.some((item) => item.product.id === productId),
  )
  const isKitInCart = computed(
    () => (kitId) => kitItems.value.some((item) => item.kit.id === kitId),
  )

  watch(
    [items, kitItems],
    () => localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ products: items.value, kits: kitItems.value }),
    ),
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
      return { ok: false, message: productStockMessage(stock) }
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
      message: currentQuantity + desired > stock
        ? productStockMessage(stock)
        : '',
    }
  }

  function addKitToCart(kit, quantity = 1) {
    if (!kit?.id || kit.is_active === false || !kit.is_in_stock) {
      return { ok: false, message: 'Este kit não está disponível no momento.' }
    }

    const stock = availableKitStock(kit)
    const desired = Math.max(1, Number(quantity) || 1)
    const existing = kitItems.value.find((item) => item.kit.id === kit.id)
    const currentQuantity = existing?.quantity || 0
    const nextQuantity = Math.min(currentQuantity + desired, stock)

    if (nextQuantity <= currentQuantity) {
      return { ok: false, message: kitStockMessage() }
    }

    if (existing) {
      existing.kit = { ...existing.kit, ...kit }
      existing.quantity = nextQuantity
    } else {
      kitItems.value.push({ kit: { ...kit }, quantity: Math.min(desired, stock) })
    }

    return {
      ok: true,
      quantity: nextQuantity,
      limited: currentQuantity + desired > stock,
      message: currentQuantity + desired > stock
        ? kitStockMessage()
        : '',
    }
  }

  function removeFromCart(productId) {
    items.value = items.value.filter((item) => item.product.id !== productId)
  }

  function removeKitFromCart(kitId) {
    kitItems.value = kitItems.value.filter((item) => item.kit.id !== kitId)
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
      message: desired > stock ? productStockMessage(stock) : '',
    }
  }

  function updateKitQuantity(kitId, quantity) {
    const item = kitItems.value.find((entry) => entry.kit.id === kitId)
    if (!item) return { ok: false }

    const desired = Number(quantity)
    if (desired <= 0) {
      removeKitFromCart(kitId)
      return { ok: true, removed: true }
    }

    const stock = availableKitStock(item.kit)
    if (stock <= 0 || item.kit.is_active === false || !item.kit.is_in_stock) {
      return { ok: false, message: 'Este kit não está disponível no momento.' }
    }
    item.quantity = Math.min(Math.max(1, desired), stock)
    return {
      ok: true,
      quantity: item.quantity,
      limited: desired > stock,
      message: desired > stock ? kitStockMessage() : '',
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

  function syncKit(kit) {
    const item = kitItems.value.find((entry) => entry.kit.id === kit?.id)
    if (!item) return

    item.kit = { ...item.kit, ...kit }
    const stock = availableKitStock(item.kit)
    if (stock === 0 || item.kit.is_active === false || !item.kit.is_in_stock) return
    if (item.quantity > stock) item.quantity = stock
  }

  function removeUnavailableItems() {
    items.value = items.value.filter(
      ({ product }) =>
        product?.is_active !== false && product?.is_in_stock && availableStock(product) > 0,
    )
    items.value.forEach((item) => {
      item.quantity = Math.min(item.quantity, availableStock(item.product))
    })

    kitItems.value = kitItems.value.filter(
      ({ kit }) => kit?.is_active !== false && kit?.is_in_stock && availableKitStock(kit) > 0,
    )
    kitItems.value.forEach((item) => {
      item.quantity = Math.min(item.quantity, availableKitStock(item.kit))
    })
  }

  function clearCart() {
    items.value = []
    kitItems.value = []
  }

  async function refreshProducts() {
    const productResults = await Promise.allSettled(
      items.value.map(({ product }) => productService.getProduct(product.slug)),
    )
    productResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        syncProduct(result.value.data)
        return
      }
      const item = items.value[index]
      if (item) item.product = { ...item.product, is_active: false, is_in_stock: false }
    })

    const kitResults = await Promise.allSettled(
      kitItems.value.map(({ kit }) => kitService.get(kit.slug)),
    )
    kitResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        syncKit(result.value.data)
        return
      }
      const item = kitItems.value[index]
      if (item) item.kit = { ...item.kit, is_active: false, is_in_stock: false }
    })

    return { ok: canCheckout.value, unavailable: hasUnavailableItems.value }
  }

  return {
    items,
    kitItems,
    totalItems,
    totalPrice,
    isEmpty,
    hasUnavailableItems,
    canCheckout,
    isInCart,
    isKitInCart,
    addToCart,
    addKitToCart,
    removeFromCart,
    removeKitFromCart,
    updateQuantity,
    updateKitQuantity,
    syncProduct,
    syncKit,
    removeUnavailableItems,
    refreshProducts,
    clearCart,
  }
})
