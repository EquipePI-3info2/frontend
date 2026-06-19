import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Brookiê — Cookies e Brownies Artesanais' },
  },
  {
    path: '/produto/:slug',
    name: 'product',
    component: () => import('@/views/ProductView.vue'),
    meta: { title: 'Produto — Brookiê' },
  },
  {
    path: '/busca',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
    meta: { title: 'Buscar — Brookiê' },
  },
  {
    path: '/carrinho',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
    meta: { title: 'Carrinho — Brookiê' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Entrar — Brookiê' },
  },
  {
    path: '/cadastro',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Cadastre-se — Brookiê' },
  },
  {
    path: '/perfil',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'Meu perfil — Brookiê', requiresAuth: true },
  },
  {
  path: '/perfil/editar',
  name: 'EditProfile',
  component: () => import('@/views/EditprofileView.vue'),
  meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página não encontrada — Brookiê' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

// Guard de autenticação + títulos de página
router.beforeEach((to) => {
  document.title = to.meta.title || 'Brookiê'
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isAuthenticated) return { name: 'login' }
  }
})

export default router
