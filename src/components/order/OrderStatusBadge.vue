<template>
  <span :class="['status-badge', `status-badge--${status}`]">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ status: { type: String, required: true }, label: { type: String, default: '' } })
const labels = {
  pending: 'Aguardando pagamento', confirmed: 'Confirmado', preparing: 'Em preparo', ready: 'Pronto', delivering: 'Em entrega', delivered: 'Entregue', cancelled: 'Cancelado',
  approved: 'Aprovado', refused: 'Recusado', refunded: 'Estornado',
}
const label = computed(() => props.label || labels[props.status] || props.status)
</script>

<style scoped>
.status-badge { display: inline-flex; align-items: center; width: fit-content; border-radius: var(--radius-full); padding: 5px 11px; font-size: .7rem; line-height: 1; font-weight: 800; background: #eee; color: #555; }
.status-badge--pending { background: #fff0c9; color: #7c5512; }
.status-badge--confirmed, .status-badge--approved { background: #e2f3e7; color: #24653a; }
.status-badge--preparing { background: #f9e6d5; color: #8b4b1c; }
.status-badge--ready { background: #e6ebff; color: #344d9b; }
.status-badge--delivering { background: #e3f1fb; color: #27678f; }
.status-badge--delivered { background: #dff4e7; color: #1f6938; }
.status-badge--cancelled, .status-badge--refused { background: #f8dddd; color: #8f2929; }
.status-badge--refunded { background: #eee4f8; color: #66408d; }
</style>
