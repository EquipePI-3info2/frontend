<template>
  <section class="categories container">
    <h2 class="categories__title">Nossas deliciosas categorias</h2>

    <div v-if="loadingCats" class="categories__pills">
      <div v-for="n in 2" :key="n" class="skeleton category-skeleton" />
    </div>

    <div v-else class="categories__pills">
      <button
        v-for="cat in categories"
        :key="cat.slug"
        class="category-pill"
        :class="{ 'category-pill--active': activeCategory === cat.slug }"
        @click="setActiveCategory(cat.slug)"
      >
        <img
          :src="getCategoryImage(cat.slug)"
          :alt="cat.name"
          class="category-pill__img"
          width="36"
          height="36"
          loading="lazy"
        />
        <span class="category-pill__label">{{ cat.name }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { useProductStore } from '@/stores/useProductStore'
import { storeToRefs } from 'pinia'
import cookieUrl from '@/assets/images/cookie.png'
import brownieUrl from '@/assets/images/brownie.png'

const store = useProductStore()
const { categories, activeCategory, loadingCats } = storeToRefs(store)
const { setActiveCategory } = store

function getCategoryImage(slug) {
  if (slug === 'brownies') return brownieUrl
  return cookieUrl
}
</script>

<style scoped>
.categories {
  padding-block: var(--space-6) var(--space-4);
}

.categories__title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-text);
  text-align: center;
  margin-bottom: var(--space-4);
}

.categories__pills {
  display: flex;
  gap: var(--space-3);
}

.skeleton {
  background: linear-gradient(90deg, #f0d9d0 25%, #faeae4 50%, #f0d9d0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--radius-lg);
}
.category-skeleton {
  height: 60px;
  flex: 1;
}

.category-pill {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  border: 2px solid transparent;
  transition:
    background var(--transition),
    border-color var(--transition),
    transform var(--transition);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text);
  cursor: pointer;
}
.category-pill:active {
  transform: scale(0.97);
}

.category-pill--active {
  background: var(--color-hero-card);
  border-color: var(--color-accent);
}

.category-pill__img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: var(--radius-sm);
}
</style>
