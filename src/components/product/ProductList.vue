<template>
  <section class="product-list fade-up" style="animation-delay: 0.3s">
    <div class="section-header">
      <h2 class="section-title">
        Mais <em>vendidos</em>
      </h2>
      <RouterLink to="/catalogo" class="section-link">Ver todos →</RouterLink>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="product-list__grid">
      <div v-for="i in 4" :key="i" class="skeleton-card" aria-hidden="true">
        <div class="skeleton-img" />
        <div class="skeleton-lines">
          <div class="skeleton-line" style="width: 80%" />
          <div class="skeleton-line" style="width: 50%" />
          <div class="skeleton-line full" />
        </div>
      </div>
    </div>

    <!-- Products grid -->
    <div v-else class="product-list__grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @added="onProductAdded"
      />
    </div>
  </section>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: { type: Array, required: true },
  loading:  { type: Boolean, default: false }
})

const emit = defineEmits(['product-added'])

function onProductAdded(product) {
  emit('product-added', product)
}
</script>

<style scoped>
.product-list {
  padding: 0 var(--page-padding) var(--sp-6);
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
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

.section-link {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--c-caramel);
  text-decoration: none;
  white-space: nowrap;
}

/* 2-col grid on mobile, 3-col on wider screens */
.product-list__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-3);
}

@media (min-width: 380px) {
  .product-list__grid { gap: var(--sp-4); }
}

/* ── Skeletons ── */
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}

.skeleton-card {
  background: var(--c-surface);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.skeleton-img {
  aspect-ratio: 1;
  background: linear-gradient(90deg, var(--c-cream-dark) 25%, #ecdfc8 50%, var(--c-cream-dark) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-lines {
  padding: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.skeleton-line {
  height: 10px;
  background: linear-gradient(90deg, var(--c-cream-dark) 25%, #ecdfc8 50%, var(--c-cream-dark) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--r-full);
}

.skeleton-line.full { width: 100%; height: 28px; border-radius: var(--r-sm); }
</style>
