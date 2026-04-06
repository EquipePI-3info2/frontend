import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items   = ref([])
  const loading = ref(false)

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
  )

  function isInCart(productId) {
    return items.value.some((i) => i.product.id === productId)
  }

  function addToCart(product) {
    const existing = items.value.find((i) => i.product.id === product.id)
    if (existing) {
      existing.quantity++
      existing.subtotal = (existing.quantity * parseFloat(product.price)).toFixed(2)
    } else {
      items.value.push({
        product,
        quantity: 1,
        subtotal: parseFloat(product.price).toFixed(2),
      })
    }
  }

  function removeFromCart(productId) {
    items.value = items.value.filter((i) => i.product.id !== productId)
  }

  function updateQuantity(productId, qty) {
    const item = items.value.find((i) => i.product.id === productId)
    if (!item) return
    if (qty <= 0) { removeFromCart(productId); return }
    item.quantity = qty
    item.subtotal = (qty * parseFloat(item.product.price)).toFixed(2)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items, loading,
    totalItems, totalPrice, isInCart,
    addToCart, removeFromCart, updateQuantity, clearCart,
  }
})
