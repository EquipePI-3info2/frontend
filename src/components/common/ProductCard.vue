<template>
  <article class="product-card fade-in-up" :style="{ animationDelay: `${index * 45}ms` }" @click="goToProduct">
    <div class="product-card__image-wrap">
      <img :src="imageSrc" :alt="product.name" loading="lazy" width="160" height="148" class="product-card__image" @error="imgFailed = true" />
      <span v-if="!available" class="product-card__stock-label">Esgotado</span>
    </div>

    <div class="product-card__body">
      <p v-if="product.flavor?.name" class="product-card__flavor">{{ product.flavor.name }}</p>
      <h3 class="product-card__name">{{ product.name }}</h3>
      <p class="product-card__price">{{ formatCurrency(product.price) }}</p>
      <AppButton
        variant="accent"
        size="sm"
        class="product-card__btn"
        :class="{ 'product-card__btn--added': added }"
        :disabled="!available"
        @click.stop="handleAdd"
      >
        {{ !available ? 'indisponível' : added ? '✓ adicionado' : 'adicionar' }}
      </AppButton>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/useCartStore'
import { resolveFallbackProductImage, resolveProductImage } from '@/stores/useProductStore'
import { formatCurrency } from '@/utils/formatters'
import AppButton from './AppButton.vue'

const props = defineProps({
  product: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const router = useRouter()
const cartStore = useCartStore()
const added = ref(false)
const imgFailed = ref(false)
const available = computed(() => props.product.is_active !== false && props.product.is_in_stock && Number(props.product.stock) > 0)
const imageSrc = computed(() =>
  imgFailed.value
    ? resolveFallbackProductImage(props.product)
    : resolveProductImage(props.product),
)

function handleAdd() {
  const result = cartStore.addToCart(props.product)
  if (!result.ok) return
  added.value = true
  window.setTimeout(() => (added.value = false), 1600)
}
function goToProduct() {
  router.push({ name: 'product', params: { slug: props.product.slug } })
}
</script>

<style scoped>
.product-card { background: var(--color-surface); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); cursor: pointer; transition: transform var(--transition), box-shadow var(--transition); display: flex; flex-direction: column; }
.product-card:active { transform: scale(.98); box-shadow: var(--shadow-md); }
.product-card__image-wrap { position: relative; background: #fdf3ee; display: flex; align-items: center; justify-content: center; overflow: hidden; height: 148px; }
.product-card__image { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
.product-card:hover .product-card__image { transform: scale(1.04); }
.product-card__stock-label { position: absolute; inset: auto 8px 8px auto; padding: 4px 9px; border-radius: var(--radius-full); background: rgba(59,26,8,.88); color: white; font-size: .65rem; font-weight: 800; }
.product-card__body { padding: .75rem; display: flex; flex-direction: column; flex: 1; gap: .2rem; }
.product-card__flavor { color: var(--color-text-muted); font-size: .66rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
.product-card__name { font-size: .875rem; font-weight: 700; color: var(--color-text); line-height: 1.3; }
.product-card__price { font-size: .875rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: .4rem; }
.product-card__btn { width: 100%; font-size: .8rem; min-height: 36px; margin-top: auto; }
.product-card__btn--added { background: #6ec46e !important; color: #fff !important; }
</style>
