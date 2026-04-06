import api from './api.js'

export const productService = {
  async getProducts(categorySlug = null) {
    const params = {}
    if (categorySlug) params.category = categorySlug
    const { data } = await api.get('/products/', { params })
    return data.results ?? data
  },
  async getProductById(id) {
    const { data } = await api.get(`/products/${id}/`)
    return data
  },
  async getCategories() {
    const { data } = await api.get('/categories/')
    return data.results ?? data
  },
}
