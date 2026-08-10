<template>
  <ol class="timeline">
    <li v-for="(step, index) in steps" :key="step.value" :class="{ 'timeline__item--done': index <= currentIndex, 'timeline__item--cancelled': cancelled }">
      <span class="timeline__dot"><Check v-if="index < currentIndex && !cancelled" :size="8" /></span>
      <div class="timeline__content">
        <strong>{{ step.label }}</strong>
        <small>{{ step.description }}</small>
      </div>
    </li>
  </ol>
</template>
<script setup>
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
const props = defineProps({ status: { type: String, required: true }, deliveryMethod: { type: String, default: 'delivery' } })
const cancelled = computed(() => props.status === 'cancelled')
const steps = computed(() => {
  const base = [
    { value: 'pending', label: 'Pedido criado', description: 'Aguardando confirmação do pagamento' },
    { value: 'confirmed', label: 'Confirmado', description: 'Pagamento confirmado' },
    { value: 'preparing', label: 'Em preparo', description: 'Seu pedido está sendo preparado' },
    { value: 'ready', label: 'Pronto', description: props.deliveryMethod === 'pickup' ? 'Disponível para retirada' : 'Pronto para sair' },
  ]
  if (props.deliveryMethod === 'delivery') base.push({ value: 'delivering', label: 'Em entrega', description: 'Pedido a caminho' })
  base.push({ value: 'delivered', label: 'Concluído', description: props.deliveryMethod === 'pickup' ? 'Pedido retirado' : 'Pedido entregue' })
  return base
})
const currentIndex = computed(() => {
  if (cancelled.value) return 0
  const index = steps.value.findIndex((step) => step.value === props.status)
  return Math.max(0, index)
})
</script>
<style scoped>
.timeline { display: flex; flex-direction: column; padding-top: 2px; }
.timeline__item { position: relative; display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 14px; min-height: 62px; color: #a68c80; }
.timeline__item:not(:last-child)::after { content: ''; position: absolute; left: 6px; top: 15px; bottom: 0; width: 2px; background: #e5d5cd; }
.timeline__dot { width: 14px; height: 14px; margin-top: 2px; border: 2px solid #d5bfb4; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; z-index: 1; }
.timeline__content { display: flex; flex-direction: column; gap: 4px; padding-bottom: 16px; }
.timeline__item strong { font-size: .84rem; line-height: 1.3; }
.timeline__item small { color: var(--color-text-muted); font-size: .7rem; line-height: 1.45; }
.timeline__item--done { color: var(--color-primary); }
.timeline__item--done .timeline__dot { background: var(--color-primary); border-color: var(--color-primary); color: white; }
.timeline__item--done:not(:last-child)::after { background: var(--color-primary); }
.timeline__item--cancelled { color: #922d2d; }
.timeline__item--cancelled .timeline__dot { border-color: #c55; background: #f8dddd; }
</style>
