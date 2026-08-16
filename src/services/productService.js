import api from './api'

const productService = {
  getProducts(params = {}) {
    return api.get('/products/', { params })
  },
  getProduct(slug) {
    return api.get(`/products/${slug}/`)
  },
  createProduct(payload) {
    return api.post('/products/', payload)
  },
  updateProduct(slug, payload) {
    return api.patch(`/products/${slug}/`, payload)
  },
  deleteProduct(slug) {
    return api.delete(`/products/${slug}/`)
  },

  getCategories(params = {}) {
    return api.get('/categories/', { params })
  },
  getCategoryProducts(slug) {
    return api.get(`/categories/${slug}/products/`)
  },
  createCategory(payload) {
    return api.post('/categories/', payload)
  },
  updateCategory(slug, payload) {
    return api.patch(`/categories/${slug}/`, payload)
  },
  deleteCategory(slug) {
    return api.delete(`/categories/${slug}/`)
  },

  getFlavors(params = {}) {
    return api.get('/flavors/', { params })
  },
  createFlavor(payload) {
    return api.post('/flavors/', payload)
  },
  updateFlavor(slug, payload) {
    return api.patch(`/flavors/${slug}/`, payload)
  },
  deleteFlavor(slug) {
    return api.delete(`/flavors/${slug}/`)
  },
}

export default productService
