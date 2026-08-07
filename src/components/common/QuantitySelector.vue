<template>
  <div class="quantity-selector" :aria-label="`Quantidade: ${modelValue}`">
    <button type="button" :disabled="disabled || modelValue <= min" aria-label="Diminuir" @click="change(-1)">
      <Minus :size="17" />
    </button>
    <span>{{ modelValue }}</span>
    <button type="button" :disabled="disabled || modelValue >= max" aria-label="Aumentar" @click="change(1)">
      <Plus :size="17" />
    </button>
  </div>
</template>

<script setup>
import { Minus, Plus } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

function change(delta) {
  const next = Math.min(props.max, Math.max(props.min, props.modelValue + delta))
  emit('update:modelValue', next)
}
</script>

<style scoped>
.quantity-selector {
  display: inline-grid;
  grid-template-columns: 38px 42px 38px;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  background: var(--color-surface);
}
.quantity-selector button {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.quantity-selector button:disabled { opacity: .3; cursor: not-allowed; }
.quantity-selector span { text-align: center; font-weight: 800; }
</style>
