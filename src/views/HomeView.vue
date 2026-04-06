<template>
  <div class="home-view">
    <AppHeader @toggle-menu="menuOpen = !menuOpen" />

    <main class="home-view__main pb-nav" id="main-content">
      <HeroBanner />
      <CategoryFilter />
      <ProductGrid />
    </main>

    <BottomNav />

    <Transition name="slide-menu">
      <aside
        v-if="menuOpen"
        class="home-view__sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div class="home-view__sidebar-header">
          <img :src="logoUrl" alt="Brookiê" class="home-view__sidebar-logo" />
          <button class="home-view__sidebar-close" aria-label="Fechar menu" @click="menuOpen = false">
            <XIcon :size="22" />
          </button>
        </div>
        <nav class="home-view__sidebar-nav" aria-label="Menu lateral">
          <RouterLink to="/"         @click="menuOpen = false">Início</RouterLink>
          <RouterLink to="/busca"    @click="menuOpen = false">Buscar produtos</RouterLink>
          <RouterLink to="/carrinho" @click="menuOpen = false">Carrinho</RouterLink>
          <RouterLink to="/perfil"   @click="menuOpen = false">Meu Perfil</RouterLink>
          <RouterLink to="/login"    @click="menuOpen = false">Entrar</RouterLink>
        </nav>
      </aside>
    </Transition>

    <Transition name="fade-overlay">
      <div v-if="menuOpen" class="home-view__overlay" aria-hidden="true" @click="menuOpen = false" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { XIcon } from 'lucide-vue-next'

import AppHeader      from '@/components/layout/AppHeader.vue'
import BottomNav      from '@/components/layout/BottomNav.vue'
import HeroBanner     from '@/components/home/HeroBanner.vue'
import CategoryFilter from '@/components/home/CategoryFilter.vue'
import ProductGrid    from '@/components/home/ProductGrid.vue'

import { useProductStore } from '@/stores/useProductStore.js'
import logoUrl from '@/assets/images/logo.png'

const store    = useProductStore()
const menuOpen = ref(false)

onMounted(async () => {
  await Promise.all([
    store.fetchCategories(),
    store.fetchProducts(store.activeCategory),
  ])
})
</script>

<style scoped>
.home-view { position: relative; min-height: 100dvh; }
.home-view__main { padding-top: var(--space-2); }

.home-view__sidebar {
  position: fixed;
  inset: 0 0 0 auto;
  width: min(280px, 80vw);
  background-color: var(--color-surface);
  z-index: 300;
  display: flex;
  flex-direction: column;
  padding: var(--space-6) var(--space-5);
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
}
.home-view__sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-8);
}
.home-view__sidebar-logo { height: 36px; width: auto; object-fit: contain; }
.home-view__sidebar-close {
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px;
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  background: transparent; border: none; cursor: pointer;
}
.home-view__sidebar-close:hover { background-color: rgba(59, 26, 8, 0.07); }
.home-view__sidebar-nav { display: flex; flex-direction: column; gap: var(--space-1); }
.home-view__sidebar-nav a {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color var(--transition-fast);
}
.home-view__sidebar-nav a:hover,
.home-view__sidebar-nav a.router-link-active { background-color: var(--color-hero-card); color: var(--color-primary); }

.home-view__overlay {
  position: fixed; inset: 0;
  background-color: rgba(59, 26, 8, 0.35);
  backdrop-filter: blur(2px);
  z-index: 250;
}

.slide-menu-enter-active,
.slide-menu-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-menu-enter-from,
.slide-menu-leave-to { transform: translateX(100%); }

.fade-overlay-enter-active,
.fade-overlay-leave-active { transition: opacity 0.25s ease; }
.fade-overlay-enter-from,
.fade-overlay-leave-to { opacity: 0; }
</style>
