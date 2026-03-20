<template>
  <article
    class="product-card"
    :class="{ 'product-card--unavailable': !product.available }"
  >
    <!-- Image area -->
    <RouterLink :to="`/produto/${product.slug}`" class="product-card__image-wrap">
      <div class="product-card__image" :class="{ 'is-loading': !imageLoaded }">
        <span class="product-emoji" aria-hidden="true">{{ product.emoji }}</span>
      </div>
      <span
        v-if="product.badge"
        class="product-card__badge"
        :class="`badge--${badgeType}`"
      >{{ product.badge }}</span>
    </RouterLink>

    <!-- Info -->
    <div class="product-card__info">
      <RouterLink :to="`/produto/${product.slug}`" class="product-card__name">
        {{ product.name }}
      </RouterLink>

      <div class="product-card__pricing">
        <span v-if="product.originalPrice" class="price-original">
          R$ {{ formatPrice(product.originalPrice) }}
        </span>
        <span class="price-current">R$ {{ formatPrice(product.price) }}</span>
      </div>

      <button
        class="product-card__add"
        :disabled="!product.available || adding"
        @click.prevent="handleAdd"
        :aria-label="`Adicionar ${product.name} ao carrinho`"
      >
        <span v-if="adding" class="add-feedback">✓ Adicionado!</span>
        <span v-else-if="!product.available">Indisponível</span>
        <span v-else>+ Adicionar</span>
      </button>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  product: {
    type: Object,
    required: true
    // { id, slug, name, emoji, price, originalPrice, badge, available }
  }
})

const emit = defineEmits(['added'])

const cart = useCartStore()
const toast = useToast()
const imageLoaded = ref(true)
const adding = ref(false)

const badgeType = computed(() => {
  const map = { 'Novo': 'new', 'Promoção': 'sale', 'Destaque': 'featured', 'Mais pedido': 'top' }
  return map[props.product.badge] ?? 'default'
})

async function handleAdd() {
  if (adding.value) return
  adding.value = true
  cart.addItem(props.product)
  toast.success(`${props.product.name} adicionado! 🍪`)
  emit('added', props.product)
  await new Promise(r => setTimeout(r, 1400))
  adding.value = false
}

function formatPrice(val) {
  return val.toFixed(2).replace('.', ',')
}

import { computed } from 'vue'
</script>

<style scoped>
.product-card {
  background: var(--c-surface);
  border-radius: var(--r-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-card);
  transition: transform var(--t-slow), box-shadow var(--t-normal);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-float);
}

.product-card--unavailable { opacity: 0.55; }

/* Image */
.product-card__image-wrap {
  position: relative;
  display: block;
  text-decoration: none;
  background: var(--c-cream-dark);
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card__image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-emoji {
  font-size: 3.5rem;
  line-height: 1;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
  transition: transform var(--t-slow);
}

.product-card__image-wrap:hover .product-emoji {
  transform: scale(1.1) rotate(-5deg);
}

/* Badge */
.product-card__badge {
  position: absolute;
  top: var(--sp-2);
  left: var(--sp-2);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 2px var(--sp-2);
  border-radius: var(--r-full);
  text-transform: uppercase;
}

.badge--new      { background: #d4edda; color: #1a5c2a; }
.badge--sale     { background: #fde8e8; color: var(--c-error); }
.badge--featured { background: #fff3cd; color: #7a5a00; }
.badge--top      { background: var(--c-caramel); color: #fff; }
.badge--default  { background: var(--c-cream-dark); color: var(--c-muted); }

/* Info */
.product-card__info {
  padding: var(--sp-3);
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  flex: 1;
}

.product-card__name {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--c-espresso);
  line-height: 1.3;
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__pricing {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.price-original {
  font-size: 0.65rem;
  color: var(--c-muted);
  text-decoration: line-through;
}

.price-current {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--c-caramel);
}

/* Add button */
.product-card__add {
  margin-top: auto;
  width: 100%;
  padding: var(--sp-2) var(--sp-3);
  background: var(--c-espresso);
  color: var(--c-cream);
  font-weight: 700;
  font-size: 0.75rem;
  border-radius: var(--r-sm);
  border: none;
  cursor: pointer;
  transition: background var(--t-fast), transform var(--t-slow);
}

.product-card__add:hover:not(:disabled) { background: var(--c-caramel); }
.product-card__add:active:not(:disabled) { transform: scale(0.97); }
.product-card__add:disabled { opacity: 0.6; cursor: not-allowed; }

.add-feedback { color: #86efac; }
</style>
