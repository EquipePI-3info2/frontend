import api from './api.js'

export const cartService = {
  async getCart() {
    const { data } = await api.get('/cart/')
    return data
  },
  async addItem({ product_id, quantity = 1 }) {
    const { data } = await api.post('/cart/items/', { product_id, quantity })
    return data
  },
  async updateItem(itemId, { quantity }) {
    const { data } = await api.patch(`/cart/items/${itemId}/`, { quantity })
    return data
  },
  async removeItem(itemId) {
    await api.delete(`/cart/items/${itemId}/`)
  },
  async clearCart() {
    await api.delete('/cart/clear/')
  },
}
