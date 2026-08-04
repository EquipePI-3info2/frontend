<template>
  <article class="cart-item" :class="{ 'cart-item--unavailable': unavailable }">
    <img :src="image" :alt="item.product.name" class="cart-item__image" @error="imageFailed = true" />
    <div class="cart-item__content">
      <div class="cart-item__top">
        <div>
          <h2>{{ item.product.name }}</h2>
          <p>{{ formatCurrency(item.product.price) }}</p>
        </div>
        <button type="button" class="cart-item__remove" aria-label="Remover produto" @click="$emit('remove')">
          <Trash2 :size="18" />
        </button>
      </div>
      <p v-if="unavailable" class="cart-item__warning">Produto indisponível ou quantidade acima do estoque.</p>
      <div class="cart-item__bottom">
        <QuantitySelector
          :model-value="item.quantity"
          :max="Math.max(1, Number(item.product.stock || 0))"
          :disabled="unavailable && Number(item.product.stock || 0) === 0"
          @update:model-value="$emit('update-quantity', $event)"
        />
        <strong>{{ formatCurrency(subtotal) }}</strong>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import QuantitySelector from '@/components/common/QuantitySelector.vue'
import { resolveFallbackProductImage, resolveProductImage } from '@/stores/useProductStore'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({ item: { type: Object, required: true } })
defineEmits(['remove', 'update-quantity'])

const imageFailed = ref(false)
const image = computed(() =>
  imageFailed.value
    ? resolveFallbackProductImage(props.item.product)
    : resolveProductImage(props.item.product),
)
const subtotal = computed(() => Number(props.item.product.price || 0) * props.item.quantity)
const unavailable = computed(() =>
  props.item.product.is_active === false ||
  !props.item.product.is_in_stock ||
  props.item.quantity > Number(props.item.product.stock || 0),
)
</script>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
.cart-item--unavailable { border: 1px solid #d98b8b; }
.cart-item__image { width: 92px; height: 92px; border-radius: var(--radius-md); object-fit: cover; background: #fdf3ee; }
.cart-item__content { min-width: 0; display: flex; flex-direction: column; gap: var(--space-2); }
.cart-item__top { display: flex; justify-content: space-between; gap: var(--space-2); }
.cart-item__top h2 { font-size: .95rem; line-height: 1.25; }
.cart-item__top p { color: var(--color-text-muted); font-size: .82rem; }
.cart-item__remove { color: #a33c3c; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); }
.cart-item__remove:active { background: #fde7e7; }
.cart-item__warning { font-size: .72rem; color: #9a2f2f; font-weight: 700; }
.cart-item__bottom { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); }
.cart-item__bottom strong { font-size: .9rem; }
</style>
