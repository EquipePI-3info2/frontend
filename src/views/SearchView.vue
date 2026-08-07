<template>
  <div class="search-page pb-nav">
    <PageHeader title="Buscar produtos" fallback="/" />
    <main class="container search-page__content">
      <div class="search-page__bar">
        <Search :size="20" />
        <input v-model.trim="filters.search" type="search" placeholder="Cookie, brownie, sabor…" aria-label="Buscar produtos" />
        <button v-if="filters.search" type="button" aria-label="Limpar busca" @click="filters.search = ''"><X :size="18" /></button>
      </div>

      <details class="search-page__filters">
        <summary><SlidersHorizontal :size="18" /> Filtros</summary>
        <div class="search-page__filter-grid">
          <label><span>Categoria</span><select v-model="filters.category"><option value="">Todas</option><option v-for="category in store.categories" :key="category.slug" :value="category.slug">{{ category.name }}</option></select></label>
          <label><span>Ordenar</span><select v-model="filters.ordering"><option value="">Destaques</option><option value="price">Menor preço</option><option value="-price">Maior preço</option><option value="name">Nome</option></select></label>
          <label><span>Preço mínimo</span><input v-model="filters.price_min" type="number" min="0" step="0.01" /></label>
          <label><span>Preço máximo</span><input v-model="filters.price_max" type="number" min="0" step="0.01" /></label>
          <label class="search-page__check"><input v-model="filters.in_stock" type="checkbox" /><span>Somente disponíveis</span></label>
        </div>
      </details>

      <FeedbackMessage :message="store.searchError" />
      <p v-if="!store.searchLoading" class="search-page__count">{{ store.searchResults.length }} produto(s) encontrado(s)</p>

      <div v-if="store.searchLoading" class="search-page__grid"><SkeletonCard v-for="n in 6" :key="n" /></div>
      <section v-else-if="!store.searchResults.length" class="search-page__empty"><PackageSearch :size="52" /><h2>Nenhum produto encontrado</h2><p>Tente alterar os termos ou os filtros.</p></section>
      <div v-else class="search-page__grid"><ProductCard v-for="(product, index) in store.searchResults" :key="product.id" :product="product" :index="index" /></div>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PackageSearch, Search, SlidersHorizontal, X } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import ProductCard from '@/components/common/ProductCard.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useProductStore } from '@/stores/useProductStore'

const store = useProductStore()
const route = useRoute()
const router = useRouter()
const filters = reactive({ search: String(route.query.q || ''), category: '', ordering: '', price_min: '', price_max: '', in_stock: true })
let timer

async function runSearch() {
  const params = { ...filters, in_stock: filters.in_stock ? 'true' : '' }
  try { await store.searchProducts(params) } catch { /* store exibe erro */ }
  const query = filters.search ? { q: filters.search } : {}
  router.replace({ query })
}
function scheduleSearch() {
  window.clearTimeout(timer)
  timer = window.setTimeout(runSearch, 350)
}
watch(filters, scheduleSearch, { deep: true })
onMounted(async () => {
  if (!store.categories.length) await store.fetchCategories()
  await runSearch()
})
onBeforeUnmount(() => window.clearTimeout(timer))
</script>

<style scoped>
.search-page { min-height: 100vh; }
.search-page__content { display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: var(--space-8); }
.search-page__bar { min-height: 54px; display: grid; grid-template-columns: 28px 1fr 36px; align-items: center; gap: var(--space-2); background: var(--color-surface); border-radius: var(--radius-full); padding: 0 var(--space-4); box-shadow: var(--shadow-sm); }
.search-page__bar input { border: 0; outline: 0; background: transparent; min-width: 0; }
.search-page__bar button { display: flex; align-items: center; justify-content: center; }
.search-page__filters { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-3) var(--space-4); box-shadow: var(--shadow-sm); }
.search-page__filters summary { display: flex; align-items: center; gap: var(--space-2); font-weight: 800; cursor: pointer; }
.search-page__filter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); padding-top: var(--space-4); }
.search-page__filter-grid label { display: flex; flex-direction: column; gap: 5px; font-size: .73rem; font-weight: 800; }
.search-page__filter-grid input, .search-page__filter-grid select { min-height: 42px; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0 var(--space-2); background: white; outline: none; }
.search-page__check { grid-column: 1/-1; flex-direction: row !important; align-items: center; }
.search-page__check input { min-height: 0; width: 18px; height: 18px; accent-color: var(--color-primary); }
.search-page__count { color: var(--color-text-muted); font-size: .78rem; }
.search-page__grid { display: grid; grid-template-columns: repeat(2,1fr); gap: var(--space-4); }
.search-page__empty { padding: var(--space-12) 0; display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-2); color: var(--color-text-muted); }
.search-page__empty svg { color: var(--color-accent); }
.search-page__empty h2 { color: var(--color-text); font-size: 1.05rem; }
</style>
