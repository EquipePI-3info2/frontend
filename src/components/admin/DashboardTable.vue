<template>
  <section class="dashboard-table">
    <h2>{{ title }}</h2>
    <p v-if="note">{{ note }}</p>
    <p v-if="!rows.length">Sem vendas no período.</p>
    <table v-else :aria-label="title">
      <thead>
        <tr><th scope="col">{{ nameLabel }}</th><th scope="col">{{ valueLabel }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id ?? row.method">
          <th scope="row">{{ row.name }}</th>
          <td>{{ currency ? formatCurrency(row.revenue) : row.quantity }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters'

defineProps({
  title: { type: String, required: true },
  note: { type: String, default: '' },
  nameLabel: { type: String, required: true },
  valueLabel: { type: String, required: true },
  rows: { type: Array, required: true },
  currency: Boolean,
})
</script>

<style scoped>
.dashboard-table { min-width: 0; background: white; border-radius: var(--radius-lg); padding: var(--space-5); box-shadow: var(--shadow-sm); }
h2 { font-size: 1rem; }
p { font-size: .84rem; margin-top: var(--space-2); }
table { width: 100%; border-collapse: collapse; margin-top: var(--space-3); font-size: .88rem; }
th, td { text-align: left; padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border); }
tbody th { font-weight: 600; overflow-wrap: anywhere; }
tr > :last-child { text-align: right; white-space: nowrap; padding-left: var(--space-2); font-variant-numeric: tabular-nums; }
</style>
