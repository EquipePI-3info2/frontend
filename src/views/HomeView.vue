<template>
  <div class="home">
    <AppHeader @toggle-menu="menuOpen = !menuOpen" />
    <Transition name="fade"><div v-if="menuOpen" class="menu-overlay" @click="menuOpen = false" /></Transition>
    <Transition name="slide">
      <aside v-if="menuOpen" class="side-menu" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="side-menu__header"><img :src="logoUrl" alt="Brookiê" class="side-menu__logo" /><button class="side-menu__close" aria-label="Fechar menu" @click="menuOpen = false"><X :size="24" /></button></div>
        <div v-if="authStore.user" class="side-menu__user"><strong>Olá, {{ firstName }}</strong><span>{{ authStore.user.email }}</span></div>
        <nav class="side-menu__nav">
          <RouterLink to="/" @click="menuOpen = false">Início</RouterLink>
          <RouterLink to="/busca" @click="menuOpen = false">Buscar produtos</RouterLink>
          <RouterLink to="/carrinho" @click="menuOpen = false">Meu carrinho</RouterLink>
          <RouterLink v-if="authStore.isAuthenticated" to="/pedidos" @click="menuOpen = false">Meus pedidos</RouterLink>
          <RouterLink v-if="authStore.isAuthenticated" to="/perfil/enderecos" @click="menuOpen = false">Meus endereços</RouterLink>
          <RouterLink v-if="authStore.isAuthenticated" to="/perfil" @click="menuOpen = false">Meu perfil</RouterLink>
          <RouterLink v-else to="/login" @click="menuOpen = false">Entrar / Cadastrar</RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin/pedidos" @click="menuOpen = false">Administrar pedidos</RouterLink>
        </nav>
        <button v-if="authStore.isAuthenticated" class="side-menu__logout" @click="logout">Sair</button>
      </aside>
    </Transition>
    <main class="pb-nav"><HeroBanner /><CategoryFilter /><ProductGrid /></main>
    <BottomNav />
  </div>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { X } from 'lucide-vue-next'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import HeroBanner from '@/components/home/HeroBanner.vue'
import CategoryFilter from '@/components/home/CategoryFilter.vue'
import ProductGrid from '@/components/home/ProductGrid.vue'
import { useProductStore } from '@/stores/useProductStore'
import { useAuthStore } from '@/stores/useAuthStore'
import logoUrl from '@/assets/images/logo.png'
const menuOpen = ref(false); const store = useProductStore(); const authStore = useAuthStore()
const firstName = computed(() => authStore.user?.name?.split(' ')[0] || '')
function onKeydown(event) { if (event.key === 'Escape') menuOpen.value = false }
function logout() { authStore.logout(); menuOpen.value = false }
onMounted(async () => { window.addEventListener('keydown', onKeydown); await Promise.allSettled([store.fetchCategories(), store.fetchProducts('')]) })
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
<style scoped>
.menu-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,.4); }
.side-menu { position: fixed; inset: 0 0 0 auto; z-index: 400; width: min(84vw,300px); background: var(--color-bg); padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-5); box-shadow: -4px 0 24px rgba(0,0,0,.15); }
.side-menu__header { display: flex; align-items: center; justify-content: space-between; }
.side-menu__logo { height: 32px; width: auto; }
.side-menu__close { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); }
.side-menu__user { background: white; border-radius: var(--radius-lg); padding: var(--space-3) var(--space-4); display: flex; flex-direction: column; }
.side-menu__user span { color: var(--color-text-muted); font-size: .72rem; overflow-wrap: anywhere; }
.side-menu__nav { display: flex; flex-direction: column; gap: var(--space-1); }
.side-menu__nav a { padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); font-weight: 700; }
.side-menu__nav a:hover, .side-menu__nav a.router-link-active { background: var(--color-hero-card); }
.side-menu__logout { margin-top: auto; min-height: 46px; border: 1px solid #9a2f2f; border-radius: var(--radius-full); color: #9a2f2f; font-weight: 800; }
.fade-enter-active,.fade-leave-active { transition: opacity .25s ease; }.fade-enter-from,.fade-leave-to { opacity: 0; }
.slide-enter-active,.slide-leave-active { transition: transform .3s cubic-bezier(.16,1,.3,1); }.slide-enter-from,.slide-leave-to { transform: translateX(100%); }
</style>
