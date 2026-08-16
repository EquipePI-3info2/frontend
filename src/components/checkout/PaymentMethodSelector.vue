<template>
  <div class="payment-list">
    <label v-for="option in options" :key="option.value" :class="['payment-option', { 'payment-option--active': modelValue === option.value }]">
      <input type="radio" name="payment-method" :value="option.value" :checked="modelValue === option.value" @change="$emit('update:modelValue', option.value)" />
      <component :is="option.icon" :size="22" />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>
<script setup>
import { Banknote, CreditCard, QrCode, ReceiptText } from 'lucide-vue-next'
defineProps({ modelValue: { type: String, required: true } })
defineEmits(['update:modelValue'])
const options = [
  { value: 'pix', label: 'Pix', icon: QrCode },
  { value: 'credit_card', label: 'Cartão de crédito', icon: CreditCard },
  { value: 'debit_card', label: 'Cartão de débito', icon: CreditCard },
  { value: 'cash', label: 'Dinheiro', icon: Banknote },
  { value: 'bank_slip', label: 'Boleto', icon: ReceiptText },
]
</script>
<style scoped>
.payment-list { display: grid; gap: var(--space-2); }
.payment-option { display: grid; grid-template-columns: 22px 28px 1fr; align-items: center; gap: var(--space-3); min-height: 54px; padding: 0 var(--space-4); background: var(--color-surface); border: 2px solid transparent; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); cursor: pointer; font-weight: 700; }
.payment-option--active { border-color: var(--color-accent); background: #fff8f4; }
.payment-option input { width: 18px; height: 18px; accent-color: var(--color-primary); }
</style>
