<template>
  <section id="produtos" class="product-grid container">

    <!-- Skeleton loading -->
    <div v-if="loading" class="product-grid__grid">
      <SkeletonCard v-for="n in 4" :key="n" />
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="product-grid__state">
      <AlertCircle :size="40" class="product-grid__state-icon" />
      <p class="product-grid__state-title">Ops, algo deu errado</p>
      <p class="product-grid__state-msg">{{ error }}</p>
      <AppButton variant="outline" size="sm" @click="retry">Tentar novamente</AppButton>
    </div>

    <!-- Sem produtos -->
    <div v-else-if="!products.length" class="product-grid__state">
      <PackageOpen :size="48" class="product-grid__state-icon" />
      <p class="product-grid__state-title">Nenhum produto encontrado</p>
      <p class="product-grid__state-msg">Ainda não há produtos nessa categoria.</p>
    </div>

    <!-- Grade de produtos -->
    <div v-else class="product-grid__grid">
      <ProductCard
        v-for="(product, index) in products"
        :key="product.id"
        :product="product"
        :index="index"
      />
    </div>

  </section>
</template>

<script setup>
import { AlertCircle, PackageOpen } from 'lucide-vue-next'
import { useProductStore } from '@/stores/useProductStore'
import { storeToRefs } from 'pinia'
import ProductCard  from '@/components/common/ProductCard.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import AppButton    from '@/components/common/AppButton.vue'

const store = useProductStore()
const { products, loading, error, activeCategory } = storeToRefs(store)

function retry() {
  store.fetchProducts(activeCategory.value)
}
</script>

<style scoped>
.product-grid {
  padding-bottom: var(--space-4);
}
.product-grid__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}
@media (min-width: 480px) {
  .product-grid__grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 768px) {
  .product-grid__grid { grid-template-columns: repeat(4, 1fr); }
}

/* Empty / Error state */
.product-grid__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-12) var(--space-8);
  gap: var(--space-3);
  color: var(--color-text-muted);
}
.product-grid__state-icon { color: var(--color-accent); }
.product-grid__state-title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text);
}
.product-grid__state-msg { font-size: 0.875rem; max-width: 28ch; }
</style>
