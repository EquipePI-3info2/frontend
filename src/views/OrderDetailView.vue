<template>
  <div class="order-detail pb-nav">
    <PageHeader :title="order?.code || 'Detalhes do pedido'" :fallback="authStore.isAdmin && route.meta.requiresAdmin ? '/admin/pedidos' : '/pedidos'" />
    <main class="container order-detail__content">
      <div v-if="store.loading" class="order-detail__state">Carregando pedido…</div>
      <section v-else-if="store.error" class="order-detail__state"><FeedbackMessage :message="store.error" /></section>
      <template v-else-if="order">
        <section class="detail-card detail-card--hero">
          <div>
            <p>Pedido realizado em {{ formatDateTime(order.created_at) }}</p>
            <h1>{{ order.code }}</h1>
          </div>
          <OrderStatusBadge :status="order.status" :label="order.status_display" />
        </section>

        <section v-if="order.status === 'cancelled'" class="detail-card">
          <FeedbackMessage type="error" message="Este pedido foi cancelado." />
          <p v-if="order.cancelled_at" class="order-detail__muted">Cancelado em {{ formatDateTime(order.cancelled_at) }}.</p>
        </section>
        <section v-else class="detail-card"><h2>Acompanhamento</h2><OrderTimeline :status="order.status" :delivery-method="order.delivery_method" /></section>

        <section class="detail-card">
          <h2>Itens</h2>
          <article v-for="item in order.items" :key="item.id" class="order-item">
            <img :src="item.product_image || fallbackImage(item)" :alt="item.product_name" />
            <div><strong>{{ item.product_name }}</strong><p>{{ item.quantity }} × {{ formatCurrency(item.unit_price) }}</p></div>
            <strong>{{ formatCurrency(item.subtotal) }}</strong>
          </article>
          <div class="totals"><span>Subtotal</span><span>{{ formatCurrency(order.subtotal) }}</span><span>Desconto</span><span>{{ formatCurrency(order.discount) }}</span><span>Entrega</span><span>{{ formatCurrency(order.delivery_fee) }}</span><strong>Total</strong><strong>{{ formatCurrency(order.total) }}</strong></div>
        </section>

        <section class="detail-card">
          <h2>Pagamento</h2>
          <div class="detail-grid"><span>Método</span><strong>{{ order.payment?.method_display || '—' }}</strong><span>Status</span><OrderStatusBadge v-if="order.payment" :status="order.payment.status" :label="order.payment.status_display" /><span>Valor pago</span><strong>{{ formatCurrency(order.payment?.amount_paid) }}</strong><template v-if="order.payment?.transaction_id"><span>Transação</span><strong>{{ order.payment.transaction_id }}</strong></template></div>
        </section>

        <section class="detail-card">
          <h2>{{ order.delivery_method === 'pickup' ? 'Retirada' : 'Entrega' }}</h2>
          <div class="detail-grid"><span>Forma</span><strong>{{ order.delivery_method_display }}</strong><template v-if="order.delivery_method === 'delivery'"><span>Endereço</span><strong>{{ order.delivery_address }}</strong><span>Cidade</span><strong>{{ order.delivery_city }}/{{ order.delivery_state }}</strong><span>CEP</span><strong>{{ order.delivery_zip }}</strong></template><template v-if="order.delivery_notes"><span>Observações</span><strong>{{ order.delivery_notes }}</strong></template></div>
        </section>

        <section v-if="authStore.isAdmin" class="detail-card">
          <h2>Cliente</h2>
          <div class="detail-grid">
            <span>Nome</span><strong>{{ order.customer_name || 'Não informado' }}</strong>
            <span>E-mail</span><strong>{{ order.customer_email || 'Não informado' }}</strong>
          </div>
        </section>

        <AdminOrderActions v-if="authStore.isAdmin" :order="order" @updated="handleUpdated" />

        <AppButton v-if="!authStore.isAdmin && order.status === 'pending'" variant="outline" size="lg" class="order-detail__cancel" :loading="store.saving" @click="cancelOrder">Cancelar pedido</AppButton>
      </template>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import AppButton from '@/components/common/AppButton.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import OrderStatusBadge from '@/components/order/OrderStatusBadge.vue'
import OrderTimeline from '@/components/order/OrderTimeline.vue'
import AdminOrderActions from '@/components/order/AdminOrderActions.vue'
import { resolveProductImage } from '@/stores/useProductStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useOrderStore } from '@/stores/useOrderStore'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
const route = useRoute(); const store = useOrderStore(); const authStore = useAuthStore()
const order = computed(() => store.currentOrder)
async function load() { await store.fetchOrder(route.params.id).catch(() => {}) }
onMounted(load); watch(() => route.params.id, load)
function fallbackImage(item) { return resolveProductImage({ category: { slug: String(item.category || '').toLowerCase() } }) }
function handleUpdated(updated) { if (updated) store.currentOrder = updated }
async function cancelOrder() {
  if (!window.confirm('Deseja realmente cancelar este pedido?')) return
  await store.cancelOrder(order.value.id).catch(() => {})
}
</script>

<style scoped>
.order-detail { min-height: 100vh; }
.order-detail__content { display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: calc(var(--nav-height) + var(--space-6)); }
.order-detail__state { padding: var(--space-12); text-align: center; }
.detail-card { background: white; border-radius: var(--radius-lg); padding: var(--space-5); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: var(--space-4); }
.detail-card--hero { flex-direction: row; align-items: center; justify-content: space-between; gap: var(--space-3); }
.detail-card--hero p { color: var(--color-text-muted); font-size: .72rem; }
.detail-card--hero h1 { font-size: 1.15rem; }
.detail-card h2 { font-size: 1rem; }
.order-detail__muted { color: var(--color-text-muted); font-size: .8rem; }
.order-item { display: grid; grid-template-columns: 54px 1fr auto; align-items: center; gap: var(--space-3); padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-border); font-size: .82rem; }
.order-item img { width: 54px; height: 54px; border-radius: var(--radius-md); object-fit: cover; }
.order-item p { color: var(--color-text-muted); }
.totals, .detail-grid { display: grid; grid-template-columns: 1fr auto; gap: var(--space-2) var(--space-4); font-size: .82rem; align-items: center; }
.totals span, .detail-grid span { color: var(--color-text-muted); }
.totals strong:nth-last-child(2), .totals strong:last-child { padding-top: var(--space-3); border-top: 1px solid var(--color-border); font-size: .95rem; }
.detail-grid strong { text-align: right; max-width: 240px; overflow-wrap: anywhere; }
.order-detail__cancel { width: 100%; color: #922d2d; border-color: #922d2d; }
</style>
