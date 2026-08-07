<template>
  <div class="choice-grid">
    <label v-for="option in options" :key="option.value" :class="['choice-card', { 'choice-card--active': modelValue === option.value }]">
      <input type="radio" name="delivery-method" :value="option.value" :checked="modelValue === option.value" @change="$emit('update:modelValue', option.value)" />
      <component :is="option.icon" :size="24" />
      <span><strong>{{ option.label }}</strong><small>{{ option.description }}</small></span>
    </label>
  </div>
</template>
<script setup>
import { Bike, Store } from 'lucide-vue-next'
defineProps({ modelValue: { type: String, required: true } })
defineEmits(['update:modelValue'])
const options = [
  { value: 'delivery', label: 'Entrega', description: 'Receber no endereço selecionado', icon: Bike },
  { value: 'pickup', label: 'Retirada', description: 'Buscar no local', icon: Store },
]
</script>
<style scoped>
.choice-grid { display: grid; gap: var(--space-3); }
.choice-card { display: grid; grid-template-columns: 22px 30px 1fr; align-items: center; gap: var(--space-3); padding: var(--space-4); background: var(--color-surface); border: 2px solid transparent; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); cursor: pointer; }
.choice-card--active { border-color: var(--color-accent); background: #fff8f4; }
.choice-card input { accent-color: var(--color-primary); width: 18px; height: 18px; }
.choice-card span { display: flex; flex-direction: column; }
.choice-card small { color: var(--color-text-muted); font-size: .75rem; }
</style>
