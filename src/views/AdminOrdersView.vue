<template>
  <div class="admin-page">
    <PageHeader title="Administração de pedidos" fallback="/perfil" />
    <main class="container admin-page__content">
      <nav class="admin-tabs">
        <RouterLink :to="{ name: 'admin-orders' }">Pedidos</RouterLink>
        <RouterLink :to="{ name: 'admin-payments' }">Pagamentos</RouterLink>
      </nav>

      <div class="admin-filters">
        <div class="admin-filters__search"><Search :size="18" /><input v-model.trim="search" placeholder="Código, cliente ou e-mail" /></div>
        <select v-model="status"><option value="">Todos os status</option><option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option></select>
      </div>

      <FeedbackMessage :message="store.error" />
      <p class="admin-page__count">{{ filteredOrders.length }} pedido(s)</p>
      <div v-if="store.loading" class="admin-page__state">Carregando pedidos…</div>
      <section v-else-if="!filteredOrders.length" class="admin-page__state">Nenhum pedido encontrado.</section>
      <section v-else class="admin-page__list">
        <OrderCard v-for="order in filteredOrders" :key="order.id" :order="order" :to="{ name: 'admin-order-detail', params: { id: order.id } }" />
      </section>
    </main>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Search } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import OrderCard from '@/components/order/OrderCard.vue'
import { useOrderStore } from '@/stores/useOrderStore'
const store = useOrderStore(); const search = ref(''); const status = ref('')
const statusOptions = [
  { value: 'pending', label: 'Aguardando pagamento' }, { value: 'confirmed', label: 'Confirmado' }, { value: 'preparing', label: 'Em preparo' }, { value: 'ready', label: 'Pronto' }, { value: 'delivering', label: 'Em entrega' }, { value: 'delivered', label: 'Entregue' }, { value: 'cancelled', label: 'Cancelado' },
]
const filteredOrders = computed(() => {
  const term = search.value.toLowerCase()
  return store.orders.filter((order) => {
    const matchesStatus = !status.value || order.status === status.value
    const matchesSearch = !term || [order.code, order.customer_name, order.customer_email].some((value) => String(value || '').toLowerCase().includes(term))
    return matchesStatus && matchesSearch
  })
})
onMounted(() => store.fetchAllOrders().catch(() => {}))
</script>
<style scoped>
.admin-page { min-height: 100vh; background: #f8f2ed; }
.admin-page__content { display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: var(--space-10); }
.admin-tabs { display: grid; grid-template-columns: 1fr 1fr; background: white; padding: 4px; border-radius: var(--radius-full); box-shadow: var(--shadow-sm); }
.admin-tabs a { text-align: center; padding: 9px; border-radius: var(--radius-full); font-size: .82rem; font-weight: 800; }
.admin-tabs a.router-link-active { background: var(--color-primary); color: white; }
.admin-filters { display: grid; grid-template-columns: 1fr 145px; gap: var(--space-2); }
.admin-filters__search { min-height: 46px; display: grid; grid-template-columns: 26px 1fr; align-items: center; background: white; padding: 0 var(--space-3); border-radius: var(--radius-md); }
.admin-filters input { min-width: 0; border: 0; outline: 0; background: transparent; }
.admin-filters select { border: 0; border-radius: var(--radius-md); padding: 0 var(--space-2); background: white; font-size: .78rem; }
.admin-page__count { color: var(--color-text-muted); font-size: .78rem; }
.admin-page__state { padding: var(--space-12); text-align: center; color: var(--color-text-muted); }
.admin-page__list { display: flex; flex-direction: column; gap: var(--space-3); }
@media (max-width: 400px) { .admin-filters { grid-template-columns: 1fr; } .admin-filters select { min-height: 44px; } }
</style>
