<template>
  <RouterLink
    :to="`/catalogo?categoria=${category.slug}`"
    class="category-item"
    :style="{ '--cat-bg': category.color }"
  >
    <div class="category-item__icon">{{ category.emoji }}</div>
    <span class="category-item__label">{{ category.label }}</span>
  </RouterLink>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true
    // { id, slug, label, emoji, color }
  }
})
</script>

<style scoped>
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  min-width: 80px;
  padding: var(--sp-3) var(--sp-4);
  background: var(--cat-bg, var(--c-cream-dark));
  border-radius: var(--r-lg);
  text-decoration: none;
  color: var(--c-espresso);
  flex-shrink: 0;
  transition: transform var(--t-slow), box-shadow var(--t-normal);
  box-shadow: var(--shadow-card);
}

.category-item:active {
  transform: scale(0.95);
}

.category-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-float);
}

.category-item__icon {
  font-size: 1.75rem;
  line-height: 1;
}

.category-item__label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
</style>
