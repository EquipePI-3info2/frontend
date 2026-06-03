import api from './api'

const cartService = {
  getCart() {
    return api.get('/cart/')
  },
  addItem(productId, quantity) {
    return api.post('/cart/items/', { product: productId, quantity })
  },
  updateItem(itemId, quantity) {
    return api.patch(`/cart/items/${itemId}/`, { quantity })
  },
  removeItem(itemId) {
    return api.delete(`/cart/items/${itemId}/`)
  },
  clearCart() {
    return api.delete('/cart/')
  },
}

export default cartService
