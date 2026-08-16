<template>
  <div class="payments-page">
    <PageHeader title="Administração de pagamentos" fallback="/perfil" />
    <main class="container payments-page__content">
      <AdminNav />
      <div class="payments-filters"><input v-model.trim="search" placeholder="Código ou transação" /><select v-model="status"><option value="">Todos</option><option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select></div>
      <FeedbackMessage :message="message || store.error" :type="message ? messageType : 'error'" />
      <div v-if="store.loading" class="payments-page__state">Carregando pagamentos…</div>
      <section v-else class="payments-list">
        <article v-for="payment in filteredPayments" :key="payment.id" class="payment-card">
          <div class="payment-card__top"><div><p>Pedido</p><h2>{{ payment.order_code || 'Sem pedido' }}</h2></div><OrderStatusBadge :status="payment.status" :label="payment.status_display" /></div>
          <div class="payment-card__grid"><span>Método</span><strong>{{ payment.method_display }}</strong><span>Valor pago</span><strong>{{ formatCurrency(payment.amount_paid) }}</strong><span>Criado em</span><strong>{{ formatDateTime(payment.created_at) }}</strong><template v-if="payment.transaction_id"><span>Transação</span><strong>{{ payment.transaction_id }}</strong></template></div>
          <label v-if="nextStatuses(payment).some((option) => option.value === 'approved')" class="payment-card__transaction"><span>ID da transação (opcional)</span><input v-model.trim="transactionIds[payment.id]" /></label>
          <div class="payment-card__actions"><AppButton v-for="option in nextStatuses(payment)" :key="option.value" size="sm" :variant="option.value === 'approved' ? 'primary' : 'outline'" :loading="store.saving" @click="update(payment, option.value)">{{ option.label }}</AppButton></div>
        </article>
        <div v-if="!filteredPayments.length" class="payments-page__state">Nenhum pagamento encontrado.</div>
      </section>
    </main>
    <BottomNav />
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import AdminNav from '@/components/admin/AdminNav.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import AppButton from '@/components/common/AppButton.vue'
import OrderStatusBadge from '@/components/order/OrderStatusBadge.vue'
import { useOrderStore } from '@/stores/useOrderStore'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
const store = useOrderStore(); const search = ref(''); const status = ref(''); const message = ref(''); const messageType = ref('success'); const transactionIds = reactive({})
const statusOptions = [{ value: 'pending', label: 'Pendente' }, { value: 'approved', label: 'Aprovado' }, { value: 'refused', label: 'Recusado' }, { value: 'refunded', label: 'Estornado' }, { value: 'cancelled', label: 'Cancelado' }]
const transitions = { pending: [{ value: 'approved', label: 'Aprovar' }, { value: 'refused', label: 'Recusar' }, { value: 'cancelled', label: 'Cancelar' }], refused: [{ value: 'pending', label: 'Reabrir' }, { value: 'approved', label: 'Aprovar' }, { value: 'cancelled', label: 'Cancelar' }], approved: [{ value: 'refunded', label: 'Estornar' }] }
const filteredPayments = computed(() => { const term = search.value.toLowerCase(); return store.payments.filter((payment) => (!status.value || payment.status === status.value) && (!term || [payment.order_code, payment.transaction_id].some((value) => String(value || '').toLowerCase().includes(term)))) })
function nextStatuses(payment) { return transitions[payment.status] || [] }
async function update(payment, nextStatus) { message.value = ''; try { await store.updatePaymentStatus(payment.id, { status: nextStatus, ...(transactionIds[payment.id] ? { transaction_id: transactionIds[payment.id] } : {}) }); message.value = `Pagamento ${payment.order_code || payment.id} atualizado.`; messageType.value = 'success' } catch { message.value = store.error; messageType.value = 'error' } }
onMounted(() => store.fetchPayments().catch(() => {}))
</script>
<style scoped>
.payments-page { min-height: 100vh; background: #f8f2ed; }
.payments-page__content { display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: calc(var(--nav-height) + var(--space-6)); }
.payments-filters { display: grid; grid-template-columns: 1fr 130px; gap: var(--space-2); }
.payments-filters input, .payments-filters select { min-height: 46px; border: 0; border-radius: var(--radius-md); background: white; padding: 0 var(--space-3); outline: 0; }
.payments-list { display: flex; flex-direction: column; gap: var(--space-3); }
.payment-card { background: white; border-radius: var(--radius-lg); padding: var(--space-4); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: var(--space-3); }
.payment-card__top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.payment-card__top p { color: var(--color-text-muted); font-size: .7rem; }
.payment-card__top h2 { font-size: .95rem; }
.payment-card__grid { display: grid; grid-template-columns: 1fr auto; gap: var(--space-2); font-size: .8rem; }
.payment-card__grid span { color: var(--color-text-muted); }
.payment-card__grid strong { text-align: right; overflow-wrap: anywhere; }
.payment-card__transaction { display: flex; flex-direction: column; gap: 4px; font-size: .72rem; font-weight: 800; }
.payment-card__transaction input { min-height: 42px; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); outline: 0; }
.payment-card__actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.payments-page__state { padding: var(--space-12); text-align: center; color: var(--color-text-muted); }
@media (max-width: 390px) { .payments-filters { grid-template-columns: 1fr; } }
</style>
