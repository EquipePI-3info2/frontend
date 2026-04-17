import api from './api'

const productService = {
  /**
   * Lista produtos com filtros opcionais.
   * @param {Object} params - { category, search, ordering, page }
   */
  getProducts(params = {}) {
    return api.get('/products/', { params })
  },

  /** Detalhe de um produto pelo slug */
  getProduct(slug) {
    return api.get(`/products/${slug}/`)
  },

  /** Lista todas as categorias ativas */
  getCategories() {
    return api.get('/categories/')
  },

  /** Produtos de uma categoria específica pelo slug */
  getCategoryProducts(slug) {
    return api.get(`/categories/${slug}/products/`)
  },
}

export default productService
