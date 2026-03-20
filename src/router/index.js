import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded views for better performance
const Home      = () => import('@/views/HomeView.vue')
const Catalog   = () => import('@/views/CatalogView.vue')
const Cart      = () => import('@/views/CartView.vue')
const Search    = () => import('@/views/SearchView.vue')
const Profile   = () => import('@/views/ProfileView.vue')
const Product   = () => import('@/views/ProductView.vue')

const routes = [
  { path: '/',            name: 'home',    component: Home    },
  { path: '/catalogo',    name: 'catalog', component: Catalog },
  { path: '/carrinho',    name: 'cart',    component: Cart    },
  { path: '/buscar',      name: 'search',  component: Search  },
  { path: '/perfil',      name: 'profile', component: Profile },
  { path: '/produto/:slug', name: 'product', component: Product },
  // Catch-all → redireciona para home
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? { top: 0, behavior: 'smooth' }
  }
})
