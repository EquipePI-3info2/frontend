<template>
  <section class="categories container">
    <h2 class="categories__title">Nossas deliciosas categorias</h2>

    <div v-if="loadingCats" class="categories__pills">
      <div v-for="n in 3" :key="n" class="skeleton category-skeleton" />
    </div>

    <div v-else class="categories__pills" role="list">
      <button class="category-pill" :class="{ 'category-pill--active': !activeCategory }" @click="setActiveCategory('')">
        <span class="category-pill__all">Todos</span>
      </button>
      <button v-for="cat in categories" :key="cat.slug" class="category-pill" :class="{ 'category-pill--active': activeCategory === cat.slug }" @click="setActiveCategory(cat.slug)">
        <img :src="getCategoryImage(cat)" :alt="cat.name" class="category-pill__img" width="36" height="36" loading="lazy" />
        <span class="category-pill__label">{{ cat.name }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/useProductStore'
import cookieUrl from '@/assets/images/cookie.png'
import brownieUrl from '@/assets/images/brownie.png'

const store = useProductStore()
const { categories, activeCategory, loadingCats } = storeToRefs(store)
const { setActiveCategory } = store

function getCategoryImage(category) {
  if (category.image_url) return category.image_url
  return category.slug === 'brownies' ? brownieUrl : cookieUrl
}
</script>

<style scoped>
.categories { padding-block: var(--space-6) var(--space-4); }
.categories__title { font-size: 1rem; font-weight: 800; text-align: center; margin-bottom: var(--space-4); }
.categories__pills { display: flex; gap: var(--space-3); overflow-x: auto; padding: 2px var(--space-1) var(--space-2); scrollbar-width: none; }
.categories__pills::-webkit-scrollbar { display: none; }
.skeleton { background: linear-gradient(90deg,#f0d9d0 25%,#faeae4 50%,#f0d9d0 75%); background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite; border-radius: var(--radius-lg); }
.category-skeleton { height: 60px; min-width: 125px; }
.category-pill { min-width: 116px; display: flex; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-3); border-radius: var(--radius-lg); background: var(--color-surface); border: 2px solid transparent; transition: background var(--transition),border-color var(--transition),transform var(--transition); font-size: .85rem; font-weight: 700; }
.category-pill:active { transform: scale(.97); }
.category-pill--active { background: var(--color-hero-card); border-color: var(--color-accent); }
.category-pill__img { width: 34px; height: 34px; object-fit: contain; }
.category-pill__all { min-height: 34px; display: flex; align-items: center; }
</style>
