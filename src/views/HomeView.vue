<template>
  <div class="home-view">
    <!-- Header -->
    <AppHeader :menu-open="menuOpen" @toggle-menu="menuOpen = !menuOpen" />

    <!-- Main content (scrollable, padded for bottom nav) -->
    <main class="home-view__main" id="main-content">
      <!-- Hero Banner -->
      <HeroBanner :data="heroData" @cta-click="goToCatalog" />

      <!-- Categories horizontal scroll -->
      <CategoryList :categories="categories" />

      <!-- Featured products 2-col grid -->
      <ProductList
        :products="featured"
        :loading="loading"
        @product-added="onProductAdded"
      />
    </main>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import AppHeader   from '@/components/layout/AppHeader.vue'
import BottomNav   from '@/components/layout/BottomNav.vue'
import HeroBanner  from '@/components/ui/HeroBanner.vue'
import CategoryList from '@/components/category/CategoryList.vue'
import ProductList  from '@/components/product/ProductList.vue'

import { useProductsStore } from '@/stores/products'
import { heroData } from '@/mock/data'

// ── State ─────────────────────────────────────────────
const menuOpen = ref(false)
const router   = useRouter()

// ── Store ──────────────────────────────────────────────
const productsStore = useProductsStore()
const { categories, featured, loading } = storeToRefs(productsStore)

// ── Lifecycle ──────────────────────────────────────────
onMounted(() => {
  productsStore.fetchHome()
})

// ── Handlers ──────────────────────────────────────────
function goToCatalog() {
  router.push('/catalogo')
}

function onProductAdded(product) {
  // Extensível: analytics, pixel, etc.
  console.info('[Brookie] Produto adicionado:', product.name)
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--c-cream);
}

.home-view__main {
  flex: 1;
  /* Space for fixed bottom nav */
  padding-bottom: calc(var(--bottom-nav-h) + env(safe-area-inset-bottom, 0px) + 1rem);
  /* Avoid overlap with sticky header on deep links */
  overflow-x: hidden;
}
</style>
