<template>
  <article class="kit-cart-item" :class="{ 'kit-cart-item--unavailable': unavailable }">
    <img v-if="item.kit.image_url && !imageFailed" :src="item.kit.image_url" :alt="item.kit.name" class="kit-cart-item__image" @error="imageFailed = true" />
    <div v-else class="kit-cart-item__placeholder"><Gift :size="28" /></div>
    <div class="kit-cart-item__content">
      <div class="kit-cart-item__top">
        <div><p class="kit-cart-item__tag">Kit promocional</p><h2>{{ item.kit.name }}</h2><p>{{ formatCurrency(item.kit.promotional_price) }}</p></div>
        <button type="button" class="kit-cart-item__remove" aria-label="Remover kit" @click="$emit('remove')"><Trash2 :size="18" /></button>
      </div>
      <p class="kit-cart-item__components">{{ components }}</p>
      <p v-if="unavailable" class="kit-cart-item__warning">Kit indisponível ou quantidade acima do estoque dos produtos.</p>
      <div class="kit-cart-item__bottom">
        <QuantitySelector
          :model-value="item.quantity"
          :max="Math.max(1, Number(item.kit.available_stock || 0))"
          :disabled="unavailable && Number(item.kit.available_stock || 0) === 0"
          @update:model-value="$emit('update-quantity', $event)"
        />
        <strong>{{ formatCurrency(subtotal) }}</strong>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Gift, Trash2 } from 'lucide-vue-next'
import QuantitySelector from '@/components/common/QuantitySelector.vue'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({ item: { type: Object, required: true } })
defineEmits(['remove', 'update-quantity'])
const imageFailed = ref(false)
const subtotal = computed(() => Number(props.item.kit.promotional_price || 0) * props.item.quantity)
const unavailable = computed(() =>
  props.item.kit.is_active === false
  || !props.item.kit.is_in_stock
  || props.item.quantity > Number(props.item.kit.available_stock || 0),
)
const components = computed(() =>
  (props.item.kit.items || [])
    .map((entry) => `${entry.quantity}× ${entry.product?.name || 'produto'}`)
    .join(' + '),
)
</script>

<style scoped>
.kit-cart-item { display: grid; grid-template-columns: 92px 1fr; gap: var(--space-3); padding: var(--space-3); background: #fff8f4; border: 1px solid rgba(244,169,138,.45); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.kit-cart-item--unavailable { border-color: #d98b8b; }
.kit-cart-item__image, .kit-cart-item__placeholder { width: 92px; height: 92px; border-radius: var(--radius-md); background: #f8eee8; }
.kit-cart-item__image { object-fit: cover; }
.kit-cart-item__placeholder { display: flex; align-items: center; justify-content: center; color: var(--color-primary-light); }
.kit-cart-item__content { min-width: 0; display: flex; flex-direction: column; gap: var(--space-2); }
.kit-cart-item__top { display: flex; justify-content: space-between; gap: var(--space-2); }
.kit-cart-item__tag { color: #9a5d1c !important; font-size: .62rem !important; font-weight: 900; text-transform: uppercase; }
.kit-cart-item__top h2 { font-size: .95rem; line-height: 1.25; }
.kit-cart-item__top p { color: var(--color-text-muted); font-size: .82rem; }
.kit-cart-item__remove { color: #a33c3c; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); }
.kit-cart-item__components { color: var(--color-text-muted); font-size: .68rem; line-height: 1.3; }
.kit-cart-item__warning { font-size: .72rem; color: #9a2f2f; font-weight: 700; }
.kit-cart-item__bottom { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); }
.kit-cart-item__bottom strong { font-size: .9rem; }
</style>
