import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Brookiê — Cookies e Brownies Artesanais' },
  },
  {
    path: '/produto/:id',
    name: 'produto',
    component: () => import('@/views/ProductView.vue'),
    meta: { title: 'Produto — Brookiê' },
  },
  {
    path: '/carrinho',
    name: 'carrinho',
    component: () => import('@/views/CartView.vue'),
    meta: { title: 'Carrinho — Brookiê' },
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'Meu Perfil — Brookiê', requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login — Brookiê' },
  },
  {
    path: '/busca',
    name: 'busca',
    component: () => import('@/views/SearchView.vue'),
    meta: { title: 'Busca — Brookiê' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  if (to.meta?.title) document.title = to.meta.title
})

router.beforeEach(async (to) => {
  if (!to.meta?.requiresAuth) return true
  const { useAuthStore } = await import('@/stores/useAuthStore.js')
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
