<template>
  <article class="product-card" :style="{ animationDelay: $attrs.style?.animationDelay }">
    <!-- Imagem: topo do card, full-bleed -->
    <RouterLink :to="`/produto/${product.id}`" class="product-card__image-wrap">
      <img
        :src="imageUrl"
        :alt="product.name"
        class="product-card__image"
        loading="lazy"
        width="200"
        height="200"
        @error="imgError = true"
      />
    </RouterLink>

    <!-- Corpo: nome, preço, botão -->
    <div class="product-card__body">
      <RouterLink :to="`/produto/${product.id}`" class="product-card__name">
        {{ product.name }}
      </RouterLink>

      <p class="product-card__price">{{ formattedPrice }}</p>

      <button
        class="product-card__btn"
        :class="{ 'product-card__btn--added': justAdded }"
        :aria-label="`Adicionar ${product.name} ao carrinho`"
        @click="handleAddToCart"
      >
        <CheckIcon v-if="justAdded" :size="12" />
        {{ justAdded ? 'adicionado!' : 'adicionar' }}
      </button>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { CheckIcon } from 'lucide-vue-next'
import { useCartStore } from '@/stores/useCartStore.js'
import { resolveProductImage } from '@/stores/useProductStore.js'

const props    = defineProps({ product: { type: Object, required: true } })
const cartStore = useCartStore()
const justAdded = ref(false)
const imgError  = ref(false)

const imageUrl = computed(() => resolveProductImage(props.product))

const formattedPrice = computed(() =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(parseFloat(props.product.price))
)

function handleAddToCart() {
  cartStore.addToCart(props.product)
  justAdded.value = true
  setTimeout(() => { justAdded.value = false }, 1800)
}
</script>

<style scoped>
.product-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);   /* 24px */
  overflow: hidden;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.35s ease both;
}

/* ── Imagem: full-bleed no topo, quadrada ── */
.product-card__image-wrap {
  display: block;
  overflow: hidden;
  /* Imagem quadrada com fundo levemente peach/neutro */
  background-color: #FEF3EE;
  flex-shrink: 0;
  /* Proporção 1:1 */
  aspect-ratio: 1 / 1;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.35s ease;
}

.product-card__image-wrap:hover .product-card__image {
  transform: scale(1.05);
}

/* ── Corpo do card ── */
.product-card__body {
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

/* Nome do produto */
.product-card__name {
  font-size: 0.875rem;  /* 14px fixo — igual ao Figma */
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-decoration: none;
}

/* Preço */
.product-card__price {
  font-size: 0.875rem;  /* 14px fixo */
  font-weight: 600;
  color: var(--color-text);
  line-height: 1;
}

/* Botão "adicionar" — full width, pill, salmon */
.product-card__btn {
  margin-top: var(--space-1);
  width: 100%;
  padding: var(--space-2) var(--space-2);
  height: 38px;
  border-radius: var(--radius-full);
  background-color: var(--color-accent);    /* #F4A98A */
  color: var(--color-primary);              /* #3B1A08 */
  font-family: var(--font-family);
  font-size: 0.8125rem;  /* 13px */
  font-weight: 700;
  letter-spacing: 0.01em;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  flex-shrink: 0;
  transition:
    background-color var(--transition-fast),
    transform        var(--transition-fast);
}

.product-card__btn:hover   { background-color: var(--color-accent-hover); }
.product-card__btn:active  { transform: scale(0.96); }

/* Feedback de "adicionado" */
.product-card__btn--added {
  background-color: #C8EAC0;
  color: #2A6B1A;
}
</style>
