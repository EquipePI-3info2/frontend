<template>
  <section class="categories container">

    <div v-if="loadingCats" class="categories__pills">
      <div v-for="n in 3" :key="n" class="skeleton category-skeleton" />
    </div>

    <div v-else class="categories__pills" role="list">
      <button
        class="category-pill"
        :class="{ 'category-pill--active': !activeCategory }"
        @click="setActiveCategory('')"
      >
        Todos
      </button>
      <button
        v-for="cat in visibleCategories"
        :key="cat.slug"
        class="category-pill"
        :class="{ 'category-pill--active': activeCategory === cat.slug }"
        @click="setActiveCategory(cat.slug)"
      >
        {{ cat.name }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/useProductStore'

const store = useProductStore()
const { categories, activeCategory, loadingCats } = storeToRefs(store)
const visibleCategories = computed(() =>
  categories.value.filter(
    (category) => category.name.toLowerCase() !== 'kits'
  )
)
const { setActiveCategory } = store
</script>

<style scoped>
.categories { padding-block: var(--space-6) var(--space-4); }
.categories__title { font-size: 1rem; font-weight: 800; text-align: center; margin-bottom: var(--space-4); }
.categories__pills { display: flex; gap: var(--space-2); overflow-x: auto; padding: 2px var(--space-1) var(--space-2); scrollbar-width: none; }
.categories__pills::-webkit-scrollbar { display: none; }
.skeleton { background: linear-gradient(90deg,#f0d9d0 25%,#faeae4 50%,#f0d9d0 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; border-radius: var(--radius-full); }
.category-skeleton { height: 42px; min-width: 96px; }
.category-pill { flex: 0 0 auto; min-height: 42px; padding: 0 var(--space-4); border-radius: var(--radius-full); background: var(--color-surface); border: 2px solid transparent; transition: background var(--transition), border-color var(--transition), transform var(--transition); font-size: .82rem; font-weight: 800; white-space: nowrap; }
.category-pill:active { transform: scale(.97); }
.category-pill--active { background: var(--color-hero-card); border-color: var(--color-accent); }
</style>
