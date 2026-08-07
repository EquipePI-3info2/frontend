<template>
  <section class="admin-actions">
    <h2>Controles administrativos</h2>
    <FeedbackMessage :message="message" :type="messageType" />

    <div class="admin-actions__group">
      <h3>Status do pedido</h3>
      <div v-if="nextOrderStatuses.length" class="admin-actions__buttons">
        <AppButton v-for="option in nextOrderStatuses" :key="option.value" size="sm" variant="outline" :loading="saving" @click="changeOrderStatus(option.value)">
          {{ option.label }}
        </AppButton>
      </div>
      <p v-else>Nenhuma transição de pedido disponível.</p>
    </div>

    <div v-if="order.payment" class="admin-actions__group">
      <h3>Pagamento · {{ order.payment.method_display }}</h3>
      <OrderStatusBadge :status="order.payment.status" :label="order.payment.status_display" />
      <label v-if="canAddTransaction" class="admin-actions__field">
        <span>ID da transação (opcional)</span>
        <input v-model.trim="transactionId" maxlength="200" placeholder="Ex.: PIX-12345" />
      </label>
      <div v-if="nextPaymentStatuses.length" class="admin-actions__buttons">
        <AppButton v-for="option in nextPaymentStatuses" :key="option.value" size="sm" :variant="option.value === 'approved' ? 'primary' : 'outline'" :loading="saving" @click="changePaymentStatus(option.value)">
          {{ option.label }}
        </AppButton>
      </div>
      <p v-else>Nenhuma transição de pagamento disponível.</p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import OrderStatusBadge from './OrderStatusBadge.vue'
import { useOrderStore } from '@/stores/useOrderStore'

const props = defineProps({ order: { type: Object, required: true } })
const emit = defineEmits(['updated'])
const store = useOrderStore()
const message = ref('')
const messageType = ref('success')
const transactionId = ref(props.order.payment?.transaction_id || '')
const saving = computed(() => store.saving)

const orderTransitions = {
  pending: [{ value: 'cancelled', label: 'Cancelar pedido' }],
  confirmed: [{ value: 'preparing', label: 'Iniciar preparo' }],
  preparing: [{ value: 'ready', label: 'Marcar como pronto' }],
  ready: [{ value: 'delivering', label: 'Saiu para entrega' }, { value: 'delivered', label: 'Concluir pedido' }],
  delivering: [{ value: 'delivered', label: 'Marcar como entregue' }],
}
const paymentTransitions = {
  pending: [{ value: 'approved', label: 'Aprovar' }, { value: 'refused', label: 'Recusar' }, { value: 'cancelled', label: 'Cancelar pagamento' }],
  refused: [{ value: 'pending', label: 'Voltar para pendente' }, { value: 'approved', label: 'Aprovar' }, { value: 'cancelled', label: 'Cancelar pagamento' }],
  approved: [{ value: 'refunded', label: 'Estornar' }],
}

const nextOrderStatuses = computed(() => {
  const options = orderTransitions[props.order.status] || []
  return props.order.delivery_method === 'pickup'
    ? options.filter((option) => option.value !== 'delivering')
    : options
})
const nextPaymentStatuses = computed(() => paymentTransitions[props.order.payment?.status] || [])
const canAddTransaction = computed(() => nextPaymentStatuses.value.some((option) => option.value === 'approved'))

watch(
  () => props.order.payment?.transaction_id,
  (value) => { transactionId.value = value || '' },
)

async function changeOrderStatus(status) {
  message.value = ''
  try {
    const updated = await store.updateOrderStatus(props.order.id, status)
    message.value = 'Status do pedido atualizado.'
    messageType.value = 'success'
    emit('updated', updated)
  } catch {
    message.value = store.error
    messageType.value = 'error'
  }
}
async function changePaymentStatus(status) {
  message.value = ''
  try {
    await store.updatePaymentStatus(props.order.payment.id, {
      status,
      ...(transactionId.value ? { transaction_id: transactionId.value } : {}),
    })
    message.value = 'Status do pagamento atualizado.'
    messageType.value = 'success'
    emit('updated', store.currentOrder)
  } catch {
    message.value = store.error
    messageType.value = 'error'
  }
}
</script>

<style scoped>
.admin-actions { display: flex; flex-direction: column; gap: var(--space-4); background: #fff7ec; border: 1px solid #ead6ba; border-radius: var(--radius-lg); padding: var(--space-5); }
.admin-actions h2 { font-size: 1.05rem; }
.admin-actions__group { display: flex; flex-direction: column; gap: var(--space-3); padding-top: var(--space-3); border-top: 1px solid #ead6ba; }
.admin-actions__group h3 { font-size: .9rem; }
.admin-actions__group p { color: var(--color-text-muted); font-size: .8rem; }
.admin-actions__buttons { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.admin-actions__field { display: flex; flex-direction: column; gap: 5px; font-size: .75rem; font-weight: 800; }
.admin-actions__field input { min-height: 44px; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: white; outline: none; }
</style>
