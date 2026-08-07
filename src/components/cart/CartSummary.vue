<template>
  <aside class="cart-summary">
    <h2>Resumo</h2>
    <div class="cart-summary__row"><span>Itens</span><span>{{ totalItems }}</span></div>
    <div class="cart-summary__row"><span>Subtotal</span><span>{{ formatCurrency(totalPrice) }}</span></div>
    <div class="cart-summary__row cart-summary__row--total"><span>Total previsto</span><strong>{{ formatCurrency(totalPrice) }}</strong></div>
    <p>O valor oficial será calculado e confirmado pelo backend ao criar o pedido.</p>
    <AppButton size="lg" class="cart-summary__checkout" :disabled="disabled" @click="$emit('checkout')">
      Ir para o checkout
    </AppButton>
  </aside>
</template>

<script setup>
import AppButton from '@/components/common/AppButton.vue'
import { formatCurrency } from '@/utils/formatters'

defineProps({
  totalItems: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  disabled: { type: Boolean, default: false },
})
defineEmits(['checkout'])
</script>

<style scoped>
.cart-summary { background: var(--color-surface); padding: var(--space-5); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: var(--space-3); }
.cart-summary h2 { font-size: 1.05rem; }
.cart-summary__row { display: flex; justify-content: space-between; color: var(--color-text-muted); font-size: .9rem; }
.cart-summary__row--total { padding-top: var(--space-3); border-top: 1px solid var(--color-border); color: var(--color-text); font-size: 1rem; }
.cart-summary p { font-size: .74rem; color: var(--color-text-muted); }
.cart-summary__checkout { width: 100%; margin-top: var(--space-1); }
</style>
