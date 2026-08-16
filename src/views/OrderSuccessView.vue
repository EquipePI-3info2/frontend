<template>
  <main class="success-page container">
    <div v-if="store.loading" class="success-page__state">Carregando pedido…</div>
    <div v-else-if="store.error" class="success-page__state"><FeedbackMessage :message="store.error" /><AppButton @click="router.push('/pedidos')">Ver meus pedidos</AppButton></div>
    <section v-else-if="order" class="success-card">
      <div class="success-card__icon"><Check :size="38" /></div>
      <p class="success-card__eyebrow">Pedido realizado</p>
      <h1>Obrigada pela compra!</h1>
      <p>Seu pedido <strong>{{ order.code }}</strong> foi criado com sucesso.</p>
      <OrderStatusBadge :status="order.status" :label="order.status_display" />
      <div class="success-card__summary">
        <span>Total</span><strong>{{ formatCurrency(order.total) }}</strong>
        <span>Pagamento</span><strong>{{ order.payment?.method_display }}</strong>
        <span>Recebimento</span><strong>{{ order.delivery_method_display }}</strong>
      </div>
      <FeedbackMessage type="info" message="O pagamento foi registrado como pendente. A confirmação ainda é feita pela administração nesta etapa do projeto." />
      <AppButton size="lg" @click="router.replace({ name: 'order-detail', params: { id: order.id } })">Acompanhar pedido</AppButton>
      <AppButton variant="ghost" @click="router.push('/')">Voltar à loja</AppButton>
    </section>
  </main>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'
import AppButton from '@/components/common/AppButton.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import OrderStatusBadge from '@/components/order/OrderStatusBadge.vue'
import { useOrderStore } from '@/stores/useOrderStore'
import { formatCurrency } from '@/utils/formatters'
const route = useRoute(); const router = useRouter(); const store = useOrderStore()
const order = computed(() => store.currentOrder?.id === Number(route.params.id) ? store.currentOrder : null)
onMounted(async () => { if (!order.value) await store.fetchOrder(route.params.id).catch(() => {}) })
</script>
<style scoped>
.success-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding-block: var(--space-8); }
.success-page__state { display: flex; flex-direction: column; gap: var(--space-3); text-align: center; }
.success-card { width: 100%; background: white; border-radius: var(--radius-xl); padding: var(--space-8) var(--space-5); box-shadow: var(--shadow-md); display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-3); }
.success-card__icon { width: 76px; height: 76px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #e3f5e8; color: #287443; }
.success-card__eyebrow { color: var(--color-text-muted); font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
.success-card h1 { font-size: 1.5rem; }
.success-card > p { color: var(--color-text-muted); }
.success-card__summary { width: 100%; display: grid; grid-template-columns: 1fr auto; gap: var(--space-2); text-align: left; padding: var(--space-4); border-radius: var(--radius-lg); background: #fff8f4; font-size: .83rem; }
.success-card__summary span { color: var(--color-text-muted); }
.success-card :deep(.app-btn) { width: 100%; }
</style>
