<template>
  <div class="admin-page">
    <PageHeader title="Painel administrativo" fallback="/perfil" />
    <main class="container admin-page__content">
      <AdminNav />
      <FeedbackMessage :message="store.error" />

      <div v-if="store.loading" class="admin-state">Carregando painel…</div>
      <template v-else>
        <section class="stats-grid" aria-label="Resumo administrativo">
          <article class="stat-card">
            <Package :size="22" />
            <div><strong>{{ store.stats.products }}</strong><span>Produtos</span></div>
            <small>{{ store.stats.activeProducts }} ativos</small>
          </article>
          <article class="stat-card">
            <Gift :size="22" />
            <div><strong>{{ store.stats.kits }}</strong><span>Kits</span></div>
            <small>{{ store.stats.activeKits }} ativos</small>
          </article>
          <article class="stat-card">
            <PackageX :size="22" />
            <div><strong>{{ store.stats.outOfStock }}</strong><span>Sem estoque</span></div>
            <small>Produtos indisponíveis</small>
          </article>
          <article class="stat-card">
            <Clock3 :size="22" />
            <div><strong>{{ store.stats.pendingOrders }}</strong><span>Pedidos pendentes</span></div>
            <small>Aguardando pagamento</small>
          </article>
          <article class="stat-card">
            <WalletCards :size="22" />
            <div><strong>{{ store.stats.pendingPayments }}</strong><span>Pagamentos pendentes</span></div>
            <small>Aguardando análise</small>
          </article>
        </section>

        <section class="quick-actions">
          <div class="section-title">
            <div><p>Atalhos</p><h2>Gerenciamento</h2></div>
          </div>
          <div class="quick-actions__grid">
            <RouterLink :to="{ name: 'admin-product-new' }"><PlusCircle :size="20" /><span><strong>Novo produto</strong><small>Cadastrar item no catálogo</small></span></RouterLink>
            <RouterLink :to="{ name: 'admin-kit-new' }"><Gift :size="20" /><span><strong>Novo kit</strong><small>Montar uma promoção</small></span></RouterLink>
            <RouterLink :to="{ name: 'admin-categories' }"><Tags :size="20" /><span><strong>Categorias</strong><small>Organizar a vitrine</small></span></RouterLink>
            <RouterLink :to="{ name: 'admin-flavors' }"><Cookie :size="20" /><span><strong>Sabores</strong><small>Gerenciar sabores</small></span></RouterLink>
            <RouterLink :to="{ name: 'admin-orders' }"><ClipboardList :size="20" /><span><strong>Pedidos</strong><small>Acompanhar andamento</small></span></RouterLink>
          </div>
        </section>

        <section class="recent-orders">
          <div class="section-title">
            <div><p>Atividade recente</p><h2>Últimos pedidos</h2></div>
            <RouterLink :to="{ name: 'admin-orders' }">Ver todos</RouterLink>
          </div>
          <div v-if="!store.recentOrders.length" class="admin-state admin-state--card">Nenhum pedido registrado.</div>
          <RouterLink
            v-for="order in store.recentOrders"
            :key="order.id"
            class="recent-order"
            :to="{ name: 'admin-order-detail', params: { id: order.id } }"
          >
            <div>
              <strong>{{ order.code }}</strong>
              <span>{{ order.customer_name || order.customer_email }}</span>
            </div>
            <div class="recent-order__right">
              <OrderStatusBadge :status="order.status" :label="order.status_display" />
              <small>{{ formatDateTime(order.created_at) }}</small>
            </div>
          </RouterLink>
        </section>
      </template>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ClipboardList, Clock3, Cookie, Package, PackageX, Gift, PlusCircle, Tags, WalletCards } from 'lucide-vue-next'
import AdminNav from '@/components/admin/AdminNav.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import OrderStatusBadge from '@/components/order/OrderStatusBadge.vue'
import { useAdminStore } from '@/stores/useAdminStore'
import { formatDateTime } from '@/utils/formatters'

const store = useAdminStore()

onMounted(() => store.fetchDashboard().catch(() => {}))
</script>

<style scoped>
.admin-page { min-height: 100vh; background: #f8f2ed; }
.admin-page__content { max-width: 960px; display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: calc(var(--nav-height) + var(--space-6)); }
.admin-state { padding: var(--space-12); text-align: center; color: var(--color-text-muted); }
.admin-state--card { padding: var(--space-6); background: white; border-radius: var(--radius-lg); }
.stats-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
.stat-card { min-height: 128px; display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-4); background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.stat-card > svg { color: var(--color-primary-light); }
.stat-card div { display: flex; align-items: baseline; gap: 7px; }
.stat-card strong { font-size: 1.6rem; line-height: 1; }
.stat-card span { font-size: .78rem; font-weight: 800; }
.stat-card small { margin-top: auto; color: var(--color-text-muted); font-size: .7rem; }
.quick-actions, .recent-orders { display: flex; flex-direction: column; gap: var(--space-3); }
.section-title { display: flex; align-items: end; justify-content: space-between; gap: var(--space-3); }
.section-title p { color: var(--color-text-muted); font-size: .68rem; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
.section-title h2 { font-size: 1rem; }
.section-title > a { font-size: .78rem; font-weight: 900; }
.quick-actions__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
.quick-actions__grid a { display: flex; align-items: center; gap: var(--space-3); min-height: 84px; padding: var(--space-4); background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.quick-actions__grid svg { flex: none; color: var(--color-primary-light); }
.quick-actions__grid span { display: flex; flex-direction: column; min-width: 0; }
.quick-actions__grid strong { font-size: .82rem; }
.quick-actions__grid small { color: var(--color-text-muted); font-size: .68rem; }
.recent-order { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-4); background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.recent-order > div:first-child { display: flex; flex-direction: column; min-width: 0; }
.recent-order > div:first-child strong { font-size: .86rem; }
.recent-order > div:first-child span { color: var(--color-text-muted); font-size: .72rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recent-order__right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex: none; }
.recent-order__right small { color: var(--color-text-muted); font-size: .64rem; }
@media (min-width: 720px) {
  .stats-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .quick-actions__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
</style>
