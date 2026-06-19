<template>
  <article
    class="product-card fade-in-up"
    :style="{ animationDelay: `${index * 60}ms` }"
    @click="goToProduct"
  >
    <div class="product-card__image-wrap">
      <img
        :src="imageSrc"
        :alt="product.name"
        loading="lazy"
        width="160"
        height="148"
        class="product-card__image"
        @error="onImageError"
      />
    </div>

    <div class="product-card__body">
      <h3 class="product-card__name">{{ product.name }}</h3>
      <p class="product-card__price">{{ formatPrice(product.price) }}</p>

      <AppButton
        variant="accent"
        size="sm"
        class="product-card__btn"
        :class="{ 'product-card__btn--added': added }"
        @click.stop="handleAdd"
      >
        {{ added ? '✓ adicionado' : 'adicionar' }}
      </AppButton>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/useCartStore'
import { resolveProductImage } from '@/stores/useProductStore'
import AppButton from './AppButton.vue'

const props = defineProps({
  product: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const router = useRouter()
const cartStore = useCartStore()
const added = ref(false)
const imgFailed = ref(false)

const imageSrc = computed(() =>
  imgFailed.value
    ? resolveProductImage(props.product)
    : props.product.image_url || resolveProductImage(props.product),
)

function onImageError() {
  imgFailed.value = true
}

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function handleAdd() {
  cartStore.addToCart(props.product)
  added.value = true
  setTimeout(() => (added.value = false), 1800)
}

function goToProduct() {
  router.push({ name: 'product', params: { slug: props.product.slug || props.product.id } })
}
</script>

<style scoped>
.product-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition:
    transform var(--transition),
    box-shadow var(--transition);
  display: flex;
  flex-direction: column;
}
.product-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-md);
}

.product-card__image-wrap {
  background: #fdf3ee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 148px;
}
.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}
.product-card:hover .product-card__image {
  transform: scale(1.04);
}

.product-card__body {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.2rem;
}
.product-card__name {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
}
.product-card__price {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: 0.4rem;
}
.product-card__btn {
  width: 100%;
  font-size: 0.8rem;
  min-height: 36px;
}
.product-card__btn--added {
  background: #6ec46e !important;
  color: #fff !important;
}
</style>
