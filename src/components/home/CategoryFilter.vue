<template>
  <section class="category-filter" aria-label="Filtrar por categoria">
    <div class="container">
      <h2 class="category-filter__title">Nossas deliciosas categorias</h2>

      <div class="category-filter__pills">
        <button
          v-for="cat in categories"
          :key="cat.slug"
          class="category-filter__pill"
          :class="{ 'category-filter__pill--active': activeCategory === cat.slug }"
          :aria-pressed="activeCategory === cat.slug"
          @click="select(cat.slug)"
        >
          <span class="category-filter__thumb">
            <img
              :src="cat.slug === 'cookies' ? cookieUrl : brownieUrl"
              :alt="cat.name"
              width="36"
              height="36"
              loading="lazy"
            />
          </span>
          <span class="category-filter__pill-label">{{ cat.name }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useProductStore } from '@/stores/useProductStore.js'
import cookieUrl  from '@/assets/images/cookie.png'
import brownieUrl from '@/assets/images/brownie.png'

const store          = useProductStore()
const categories     = computed(() => store.categories)
const activeCategory = computed(() => store.activeCategory)

function select(slug) {
  if (slug === activeCategory.value) return
  store.setActiveCategory(slug)
  store.fetchProducts(slug)
}
</script>

<style scoped>
.category-filter {
  padding-bottom: var(--space-5);
}

.category-filter__title {
  font-size: var(--text-lg);
  font-weight: 800;
  color: var(--color-text);
  text-align: center;
  margin-bottom: var(--space-5);
}

/* Pills wrapper — 2 colunas de tamanho igual */
.category-filter__pills {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

/* Pill: forma retangular arredondada (NOT pill-shape) */
.category-filter__pill {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg); /* 16px — retangular arredondado */
  font-family: var(--font-family);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text);
  cursor: pointer;
  min-height: 56px;
  width: 100%;
  transition:
    background-color var(--transition-fast),
    border-color     var(--transition-fast),
    box-shadow       var(--transition-fast),
    transform        var(--transition-fast);
}

.category-filter__pill:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

.category-filter__pill:active {
  transform: scale(0.97);
}

/* Estado ativo: fundo pêssego, borda salmon */
.category-filter__pill--active {
  background-color: var(--color-hero-card);
  border-color: var(--color-accent);
  color: var(--color-primary);
}

/* Thumbnail quadrada arredondada */
.category-filter__thumb {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg);
}

.category-filter__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-filter__pill-label {
  font-size: var(--text-base);
  font-weight: 700;
  line-height: 1;
}
</style>
