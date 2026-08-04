<template>
  <div class="orders-page pb-nav">
    <PageHeader title="Meus pedidos" fallback="/perfil" />
    <main class="container orders-page__content">
      <FeedbackMessage :message="store.error" />
      <div v-if="store.loading" class="orders-page__state">Carregando pedidos…</div>
      <section v-else-if="!store.orders.length" class="orders-page__empty">
        <PackageOpen :size="54" />
        <h2>Você ainda não fez pedidos</h2>
        <p>Quando finalizar uma compra, ela aparecerá aqui.</p>
        <AppButton @click="router.push('/')">Conhecer produtos</AppButton>
      </section>
      <section v-else class="orders-page__list">
        <OrderCard v-for="order in store.orders" :key="order.id" :order="order" :to="{ name: 'order-detail', params: { id: order.id } }" />
      </section>
    </main>
    <BottomNav />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PackageOpen } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import AppButton from '@/components/common/AppButton.vue'
import OrderCard from '@/components/order/OrderCard.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useOrderStore } from '@/stores/useOrderStore'
const store = useOrderStore()
const router = useRouter()
onMounted(() => store.fetchMyOrders().catch(() => {}))
</script>
<style scoped>
.orders-page { min-height: 100vh; }
.orders-page__content { padding-bottom: var(--space-8); }
.orders-page__state { padding: var(--space-12); text-align: center; color: var(--color-text-muted); }
.orders-page__empty { padding: var(--space-12) var(--space-4); display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-3); color: var(--color-text-muted); }
.orders-page__empty svg { color: var(--color-accent); }
.orders-page__empty h2 { color: var(--color-text); }
.orders-page__list { display: flex; flex-direction: column; gap: var(--space-3); }
</style>
