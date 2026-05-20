import api from './api'

const productService = {
  getProducts(params = {}) {
    return api.get('/products/', { params })
  },
  getProduct(slug) {
    return api.get(`/products/${slug}/`)
  },
  getCategories() {
    return api.get('/categories/')
  },
  getCategoryProducts(slug) {
    return api.get(`/categories/${slug}/products/`)
  },
}

export default productService
