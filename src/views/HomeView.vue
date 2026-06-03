<template>
  <div class="home">
    <AppHeader @toggle-menu="menuOpen = !menuOpen" />

    <Transition name="fade">
      <div v-if="menuOpen" class="menu-overlay" @click="menuOpen = false" />
    </Transition>

    <Transition name="slide">
      <aside v-if="menuOpen" class="side-menu" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="side-menu__header">
          <img :src="logoUrl" alt="Brookiê" class="side-menu__logo" />
          <button class="side-menu__close" aria-label="Fechar menu" @click="menuOpen = false">
            <X :size="24" />
          </button>
        </div>
        <nav class="side-menu__nav">
          <RouterLink to="/" @click="menuOpen = false">Início</RouterLink>
          <RouterLink to="/busca" @click="menuOpen = false">Buscar produtos</RouterLink>
          <RouterLink to="/carrinho" @click="menuOpen = false">Meu carrinho</RouterLink>
          <RouterLink to="/perfil" @click="menuOpen = false">Meu perfil</RouterLink>
          <RouterLink to="/login" @click="menuOpen = false">Entrar / Cadastrar</RouterLink>
        </nav>
      </aside>
    </Transition>

    <main class="pb-nav">
      <HeroBanner />
      <CategoryFilter />
      <ProductGrid />
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { X } from 'lucide-vue-next'

import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import HeroBanner from '@/components/home/HeroBanner.vue'
import CategoryFilter from '@/components/home/CategoryFilter.vue'
import ProductGrid from '@/components/home/ProductGrid.vue'
import { useProductStore } from '@/stores/useProductStore'
import logoUrl from '@/assets/images/logo.png'

const menuOpen = ref(false)
const store = useProductStore()

function onKeydown(e) {
  if (e.key === 'Escape') menuOpen.value = false
}
onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  await store.fetchCategories()
  await store.fetchProducts()
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.4);
}
.side-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 400;
  width: 280px;
  background: var(--color-bg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
}
.side-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.side-menu__logo {
  height: 32px;
  width: auto;
}
.side-menu__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  color: var(--color-text);
  transition: background var(--transition);
}
.side-menu__close:active {
  background: rgba(59, 26, 8, 0.08);
}
.side-menu__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.side-menu__nav a {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text);
  transition: background var(--transition);
}
.side-menu__nav a:hover,
.side-menu__nav a.router-link-active {
  background: var(--color-hero-card);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
