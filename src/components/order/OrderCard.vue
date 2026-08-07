<template>
  <RouterLink :to="to" class="order-card">
    <div class="order-card__top">
      <div><p>Pedido</p><h2>{{ order.code }}</h2></div>
      <OrderStatusBadge :status="order.status" :label="order.status_display" />
    </div>
    <div class="order-card__info">
      <span><CalendarDays :size="16" />{{ formatDateTime(order.created_at) }}</span>
      <span><Package :size="16" />{{ order.total_items }} item(ns)</span>
      <span><component :is="order.delivery_method === 'pickup' ? Store : Bike" :size="16" />{{ order.delivery_method_display }}</span>
    </div>
    <div class="order-card__bottom">
      <strong>{{ formatCurrency(order.total) }}</strong>
      <span>Ver detalhes <ChevronRight :size="17" /></span>
    </div>
  </RouterLink>
</template>
<script setup>
import { Bike, CalendarDays, ChevronRight, Package, Store } from 'lucide-vue-next'
import OrderStatusBadge from './OrderStatusBadge.vue'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
defineProps({ order: { type: Object, required: true }, to: { type: [String, Object], required: true } })
</script>
<style scoped>
.order-card { display: flex; flex-direction: column; gap: var(--space-3); background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-4); box-shadow: var(--shadow-sm); transition: transform var(--transition), box-shadow var(--transition); }
.order-card:active { transform: scale(.99); box-shadow: var(--shadow-md); }
.order-card__top, .order-card__bottom { display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); }
.order-card__top p { color: var(--color-text-muted); font-size: .7rem; font-weight: 700; }
.order-card__top h2 { font-size: 1rem; }
.order-card__info { display: grid; gap: 7px; color: var(--color-text-muted); font-size: .78rem; }
.order-card__info span { display: flex; align-items: center; gap: var(--space-2); }
.order-card__bottom { border-top: 1px solid var(--color-border); padding-top: var(--space-3); }
.order-card__bottom span { display: flex; align-items: center; color: var(--color-primary); font-size: .78rem; font-weight: 800; }
</style>
