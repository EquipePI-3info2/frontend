import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([]) // [{ product, quantity, subtotal }]
  const loading = ref(false)

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0),
  )

  const isInCart = computed(
    () => (productId) => items.value.some((i) => i.product.id === productId),
  )

  function addToCart(product, quantity = 1) {
    const existing = items.value.find((i) => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
      existing.subtotal = existing.quantity * parseFloat(product.price)
    } else {
      items.value.push({
        product,
        quantity,
        subtotal: quantity * parseFloat(product.price),
      })
    }
  }

  function removeFromCart(productId) {
    items.value = items.value.filter((i) => i.product.id !== productId)
  }

  function updateQuantity(productId, qty) {
    const item = items.value.find((i) => i.product.id === productId)
    if (!item) return
    if (qty <= 0) {
      removeFromCart(productId)
      return
    }
    item.quantity = qty
    item.subtotal = qty * parseFloat(item.product.price)
  }

  function clearCart() {
    items.value = []
  }

  async function fetchCart() {
    /* GET /api/cart/ */
  }

  return {
    items,
    loading,
    totalItems,
    totalPrice,
    isInCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
  }
})
