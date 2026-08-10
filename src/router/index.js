import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Brookiê — Cookies e Brownies Artesanais' } },
  { path: '/produto/:slug', name: 'product', component: () => import('@/views/ProductView.vue'), meta: { title: 'Produto — Brookiê' } },
  { path: '/busca', name: 'search', component: () => import('@/views/SearchView.vue'), meta: { title: 'Buscar — Brookiê' } },
  { path: '/carrinho', name: 'cart', component: () => import('@/views/CartView.vue'), meta: { title: 'Carrinho — Brookiê' } },
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { title: 'Entrar — Brookiê', guestOnly: true } },
  { path: '/cadastro', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { title: 'Cadastre-se — Brookiê', guestOnly: true } },
  { path: '/perfil', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { title: 'Meu perfil — Brookiê', requiresAuth: true } },
  { path: '/perfil/editar', name: 'edit-profile', alias: '/editar-perfil', component: () => import('@/views/EditprofileView.vue'), meta: { title: 'Editar perfil — Brookiê', requiresAuth: true } },
  { path: '/perfil/enderecos', name: 'addresses', component: () => import('@/views/AddressesView.vue'), meta: { title: 'Meus endereços — Brookiê', requiresAuth: true } },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue'), meta: { title: 'Finalizar pedido — Brookiê', requiresAuth: true } },
  { path: '/pedidos', name: 'orders', component: () => import('@/views/OrdersView.vue'), meta: { title: 'Meus pedidos — Brookiê', requiresAuth: true } },
  { path: '/pedidos/:id', name: 'order-detail', component: () => import('@/views/OrderDetailView.vue'), meta: { title: 'Detalhes do pedido — Brookiê', requiresAuth: true } },
  { path: '/pedidos/:id/sucesso', name: 'order-success', component: () => import('@/views/OrderSuccessView.vue'), meta: { title: 'Pedido realizado — Brookiê', requiresAuth: true } },
  { path: '/admin', name: 'admin-dashboard', component: () => import('@/views/AdminDashboardView.vue'), meta: { title: 'Painel administrativo — Brookiê', requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/produtos', name: 'admin-products', component: () => import('@/views/AdminProductsView.vue'), meta: { title: 'Administrar produtos — Brookiê', requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/produtos/novo', name: 'admin-product-new', component: () => import('@/views/AdminProductFormView.vue'), meta: { title: 'Novo produto — Brookiê', requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/produtos/:slug/editar', name: 'admin-product-edit', component: () => import('@/views/AdminProductFormView.vue'), meta: { title: 'Editar produto — Brookiê', requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/categorias', name: 'admin-categories', component: () => import('@/views/AdminCategoriesView.vue'), meta: { title: 'Administrar categorias — Brookiê', requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/sabores', name: 'admin-flavors', component: () => import('@/views/AdminFlavorsView.vue'), meta: { title: 'Administrar sabores — Brookiê', requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/pedidos', name: 'admin-orders', component: () => import('@/views/AdminOrdersView.vue'), meta: { title: 'Administrar pedidos — Brookiê', requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/pedidos/:id', name: 'admin-order-detail', component: () => import('@/views/OrderDetailView.vue'), meta: { title: 'Administrar pedido — Brookiê', requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/pagamentos', name: 'admin-payments', component: () => import('@/views/AdminPaymentsView.vue'), meta: { title: 'Administrar pagamentos — Brookiê', requiresAuth: true, requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'), meta: { title: 'Página não encontrada — Brookiê' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  document.title = to.meta.title || 'Brookiê'
  const auth = useAuthStore()

  if (auth.isAuthenticated && !auth.initialized) {
    await auth.init()
  }

  if ((to.meta.requiresAuth || to.meta.requiresAdmin) && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) return { name: 'home' }
  if (to.meta.guestOnly && auth.isAuthenticated) return { name: 'profile' }
  return true
})

export default router
