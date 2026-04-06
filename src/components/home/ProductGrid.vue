<template>
  <section class="product-grid-section" aria-label="Produtos">
    <div class="container">
      <div v-if="loading" class="product-grid" aria-busy="true">
        <SkeletonCard v-for="n in 4" :key="n" />
      </div>

      <div v-else-if="!products.length" class="empty-state" role="status">
        <div class="empty-state__icon" aria-hidden="true">
          <PackageOpenIcon :size="48" />
        </div>
        <h3 class="empty-state__title">Nenhum produto encontrado</h3>
        <p class="empty-state__desc">Não há produtos disponíveis nessa categoria por enquanto.</p>
      </div>

      <div v-else class="product-grid" role="list">
        <ProductCard
          v-for="(product, index) in products"
          :key="product.id"
          :product="product"
          role="listitem"
          :style="{ animationDelay: `${index * 60}ms` }"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { PackageOpenIcon } from 'lucide-vue-next'
import ProductCard  from '@/components/common/ProductCard.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import { useProductStore } from '@/stores/useProductStore.js'

const store    = useProductStore()
const loading  = computed(() => store.loading)
const products = computed(() => store.filteredProducts)
</script>

<style scoped>
.product-grid-section { padding-bottom: var(--space-4); }
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-12) var(--space-4);
  color: var(--color-text-muted);
  gap: var(--space-3);
  animation: fadeInUp 0.35s ease;
}
.empty-state__icon  { color: var(--color-text-faint); margin-bottom: var(--space-2); }
.empty-state__title { font-size: var(--text-base); font-weight: 700; color: var(--color-text); }
.empty-state__desc  { font-size: var(--text-sm); max-width: 28ch; line-height: 1.5; }
@media (min-width: 520px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 768px) { .product-grid { grid-template-columns: repeat(4, 1fr); } }
</style>
