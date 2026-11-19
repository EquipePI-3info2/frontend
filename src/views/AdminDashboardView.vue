<template>
  <div class="admin-page">
    <PageHeader title="Painel administrativo" fallback="/perfil" />
    <main class="container dashboard">
      <AdminNav />
      <header class="dashboard-heading">
        <h1>Visão financeira</h1>
        <label>
          Período
          <select v-model="period">
            <option value="day">Dia</option>
            <option value="week">Semana</option>
            <option value="month">Mês</option>
            <option value="year">Ano</option>
          </select>
        </label>
      </header>

      <p v-if="store.dashboardLoading" class="panel" role="status">Carregando painel…</p>
      <div v-else-if="store.dashboardError" class="panel">
        <FeedbackMessage :message="store.dashboardError" />
        <button class="retry" @click="store.fetchDashboard(period)">Tentar novamente</button>
      </div>

      <template v-else-if="data">
        <section class="panel revenue" aria-labelledby="revenue-title">
          <div>
            <h2 id="revenue-title">Total recebido</h2>
            <p class="revenue__amount">{{ formatCurrency(data.current_period.revenue) }}</p>
            <p>{{ periodDates(data.current_period) }}</p>
          </div>
          <div>
            <h3>Período anterior</h3>
            <p><strong>{{ formatCurrency(data.previous_period.revenue) }}</strong></p>
            <p>{{ periodDates(data.previous_period) }}</p>
            <p>Variação {{ variation }}</p>
          </div>
        </section>

        <dl class="metrics">
          <div v-for="metric in metrics" :key="metric.label" class="panel">
            <dt>{{ metric.label }}</dt>
            <dd>
              {{ metric.value }}
              <small v-if="metric.detail">{{ metric.detail }}</small>
            </dd>
          </div>
        </dl>

        <FeedbackMessage
          v-if="data.missing_cost_orders"
          type="info"
          :message="`Lucro e margem indisponíveis. Pedidos sem custo histórico: ${data.missing_cost_orders}.`"
        />
        <FeedbackMessage
          v-if="data.unmatched_payments"
          type="info"
          :message="`Pagamentos aprovados sem pedido vinculado: ${data.unmatched_payments}. Esses valores aparecem no total recebido e por forma de pagamento.`"
        />

        <section class="panel" aria-labelledby="chart-title">
          <h2 id="chart-title">Faturamento por período</h2>
          <p class="chart-note">Pagamentos aprovados, por data de pagamento</p>
          <p v-if="!chartMax" class="chart-note">Nenhum valor recebido no período.</p>
          <ul class="chart">
            <li v-for="point in data.series" :key="point.date">
              <span>{{ chartLabel(point.date) }}</span>
              <span class="chart__track" aria-hidden="true">
                <span class="chart__bar" :style="{ width: `${Number(point.revenue) / (chartMax || 1) * 100}%` }"></span>
              </span>
              <strong>{{ formatCurrency(point.revenue) }}</strong>
            </li>
          </ul>
        </section>

        <div class="tables">
          <DashboardTable title="Produtos mais vendidos" note="Inclui as unidades vendidas em kits." name-label="Produto" value-label="Unidades" :rows="data.products" />
          <DashboardTable title="Receita por produto" note="Vendas avulsas pelo preço registrado no pedido." name-label="Produto" value-label="Valor" :rows="productsByRevenue" currency />
          <DashboardTable title="Receita por kit" note="Valores registrados nos itens de kit." name-label="Kit" value-label="Valor" :rows="data.kits" currency />
          <DashboardTable title="Receita por forma de pagamento" name-label="Forma de pagamento" value-label="Valor" :rows="data.payment_methods" currency />
        </div>
      </template>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import AdminNav from '@/components/admin/AdminNav.vue'
import DashboardTable from '@/components/admin/DashboardTable.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useAdminStore } from '@/stores/useAdminStore'
import { formatCurrency } from '@/utils/formatters'

const store = useAdminStore()
const period = ref('week')
const data = computed(() => store.dashboard)
const chartMax = computed(() => Math.max(0, ...data.value.series.map((point) => Number(point.revenue))))
const productsByRevenue = computed(() => data.value.products
  .filter((product) => product.sold_separately)
  .sort((first, second) => Number(second.revenue) - Number(first.revenue)))

const percentFormat = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 2 })
const percent = (value) => value == null ? '—' : percentFormat.format(Number(value) / 100)
const currency = (value) => value == null ? '—' : formatCurrency(value)
const variation = computed(() => {
  const value = data.value.variation_percentage
  if (value == null) return 'indisponível (base anterior zerada)'
  return `${Number(value) > 0 ? '+' : ''}${percent(value)}`
})

const metrics = computed(() => {
  const value = data.value
  return [
    { label: 'Faturamento bruto', value: currency(value.gross_revenue), detail: 'Subtotal de produtos e kits' },
    { label: 'Faturamento líquido', value: currency(value.net_revenue), detail: 'Vendas após descontos, sem entrega' },
    { label: 'Descontos', value: currency(value.discounts), detail: `${percent(value.discount_percentage)} do faturamento bruto` },
    { label: 'Receita com entrega', value: currency(value.delivery_revenue) },
    { label: 'Lucro bruto', value: currency(value.gross_profit), detail: 'Vendas líquidas menos o custo dos itens' },
    { label: 'Margem bruta', value: percent(value.gross_margin_percentage) },
  ]
})

const fullDate = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' })
const shortDate = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit' })
const monthDate = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', month: 'short' })

function periodDates(range) {
  const start = fullDate.format(new Date(range.start))
  return range.start === range.end ? start : `${start} a ${fullDate.format(new Date(range.end))}`
}

function chartLabel(date) {
  return (data.value.period === 'year' ? monthDate : shortDate).format(new Date(date))
}

watch(period, (value) => store.fetchDashboard(value), { immediate: true })
</script>

<style scoped>
.admin-page { min-height: 100vh; background: #f8f2ed; }
.dashboard { max-width: 1040px; display: grid; gap: var(--space-4); padding-bottom: calc(var(--nav-height) + var(--space-6)); }
.dashboard-heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-3); }
.dashboard-heading h1 { font-size: clamp(1.4rem, 4vw, 2rem); }
.dashboard-heading label { display: flex; align-items: center; gap: var(--space-2); font-weight: 800; }
select { background: white; border: 1px solid #a48273; border-radius: var(--radius-sm); padding: var(--space-2); }
.panel { background: white; border-radius: var(--radius-lg); padding: var(--space-5); box-shadow: var(--shadow-sm); min-width: 0; }
.panel h2 { font-size: 1.05rem; }
.revenue { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-4); background: var(--color-primary); color: white; }
.revenue h3 { font-size: .92rem; }
.revenue p { font-size: .87rem; }
.revenue .revenue__amount { font-size: clamp(1.65rem, 6vw, 2.6rem); font-weight: 800; overflow-wrap: anywhere; }
.metrics, .tables { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
.metrics dt { font-weight: 800; font-size: .84rem; }
.metrics dd { font-size: clamp(1.08rem, 3vw, 1.5rem); font-weight: 800; overflow-wrap: anywhere; }
.metrics small { display: block; font-size: .8rem; font-weight: 600; }
.chart-note { font-size: .8rem; }
.chart { display: grid; gap: var(--space-2); margin-top: var(--space-3); }
.chart li { display: grid; grid-template-columns: 3rem minmax(0, 1fr) minmax(5.5rem, max-content); align-items: center; gap: var(--space-2); font-size: .8rem; }
.chart strong { text-align: right; font-variant-numeric: tabular-nums; }
.chart__track { display: block; border-radius: var(--radius-full); background: #f8f2ed; }
.chart__bar { display: block; border-radius: inherit; height: .65rem; background: var(--color-primary-light); }
.retry { margin-top: var(--space-3); text-decoration: underline; font-weight: 800; }
@media (min-width: 750px) { .metrics { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 599px) { .tables { grid-template-columns: minmax(0, 1fr); } }
</style>
