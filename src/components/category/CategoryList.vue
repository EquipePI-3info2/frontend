<template>
  <section class="category-list fade-up" style="animation-delay: 0.15s">
    <div class="section-header">
      <h2 class="section-title">Nossas deliciosas<br /><em>categorias</em></h2>
    </div>

    <div
      class="category-list__track"
      ref="trackRef"
      role="list"
      aria-label="Categorias de produtos"
    >
      <CategoryItem
        v-for="cat in categories"
        :key="cat.id"
        :category="cat"
        role="listitem"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import CategoryItem from './CategoryItem.vue'

defineProps({
  categories: {
    type: Array,
    required: true
  }
})

const trackRef = ref(null)
</script>

<style scoped>
.category-list {
  padding: var(--sp-6) 0;
}

.section-header {
  padding: 0 var(--page-padding);
  margin-bottom: var(--sp-5);
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--c-espresso);
  line-height: 1.25;
}

.section-title em {
  font-style: normal;
  color: var(--c-caramel);
}

.category-list__track {
  display: flex;
  gap: var(--sp-3);
  overflow-x: auto;
  padding: var(--sp-2) var(--page-padding) var(--sp-4);
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.category-list__track::-webkit-scrollbar { display: none; }

/* Each child snaps */
:deep(.category-item) {
  scroll-snap-align: start;
}
</style>
