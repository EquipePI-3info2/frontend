<template>
  <div class="admin-page">
    <PageHeader title="Kits" fallback="/admin" />
    <main class="container admin-page__content">
      <AdminNav />

      <div class="admin-toolbar">
        <div class="admin-search"><Search :size="18" /><input v-model.trim="search" placeholder="Buscar kit" /></div>
        <RouterLink class="new-button" :to="{ name: 'admin-kit-new' }"><Plus :size="18" />Novo kit</RouterLink>
      </div>

      <div class="admin-filters">
        <select v-model="visibility">
          <option value="">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="out">Indisponíveis</option>
        </select>
      </div>

      <FeedbackMessage :message="message || store.error" :type="message ? messageType : 'error'" />
      <p class="admin-count">{{ filteredKits.length }} kit(s)</p>

      <div v-if="store.loading" class="admin-state">Carregando kits…</div>
      <section v-else-if="!filteredKits.length" class="admin-state admin-state--card">Nenhum kit encontrado.</section>
      <section v-else class="kit-list">
        <article v-for="kit in filteredKits" :key="kit.id" class="kit-card">
          <img v-if="kit.image_url" :src="kit.image_url" :alt="kit.name" />
          <div v-else class="kit-card__placeholder"><Gift :size="34" /></div>
          <div class="kit-card__content">
            <div class="kit-card__top">
              <div><p>Kit promocional</p><h2>{{ kit.name }}</h2></div>
              <span :class="['status-pill', kit.is_active ? 'status-pill--active' : 'status-pill--inactive']">{{ kit.is_active ? 'Ativo' : 'Inativo' }}</span>
            </div>
            <p class="kit-card__items">{{ describeItems(kit) }}</p>
            <div class="kit-card__meta">
              <span class="old-price">{{ formatCurrency(kit.regular_price) }}</span>
              <strong>{{ formatCurrency(kit.promotional_price) }}</strong>
              <span>{{ kit.available_stock }} disponível(is)</span>
            </div>
            <div class="kit-card__actions">
              <RouterLink :to="{ name: 'admin-kit-edit', params: { slug: kit.slug } }"><Pencil :size="16" />Editar</RouterLink>
              <button type="button" @click="removeKit(kit)"><Trash2 :size="16" />Excluir</button>
            </div>
          </div>
        </article>
      </section>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Gift, Pencil, Plus, Search, Trash2 } from 'lucide-vue-next'
import AdminNav from '@/components/admin/AdminNav.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useAdminStore } from '@/stores/useAdminStore'
import { formatCurrency } from '@/utils/formatters'

const store = useAdminStore()
const search = ref('')
const visibility = ref('')
const message = ref('')
const messageType = ref('success')

const filteredKits = computed(() => {
  const term = search.value.toLowerCase()
  return store.kits.filter((kit) => {
    const itemNames = (kit.items || []).map((item) => item.product?.name).join(' ')
    const matchesSearch = !term || [kit.name, kit.description, itemNames]
      .some((value) => String(value || '').toLowerCase().includes(term))
    const matchesVisibility = !visibility.value
      || (visibility.value === 'active' && kit.is_active)
      || (visibility.value === 'inactive' && !kit.is_active)
      || (visibility.value === 'out' && Number(kit.available_stock || 0) === 0)
    return matchesSearch && matchesVisibility
  })
})

function describeItems(kit) {
  return (kit.items || [])
    .map((item) => `${item.quantity}× ${item.product?.name || 'produto'}`)
    .join(' + ')
}

async function removeKit(kit) {
  if (!window.confirm(`Excluir o kit “${kit.name}”?`)) return
  message.value = ''
  try {
    await store.deleteKit(kit.slug)
    await store.fetchKits()
    message.value = 'Kit excluído.'
    messageType.value = 'success'
  } catch {
    message.value = store.error
    messageType.value = 'error'
  }
}

onMounted(() => store.fetchKits().catch(() => {}))
</script>

<style scoped>
.admin-page { min-height: 100vh; background: #f8f2ed; }
.admin-page__content { max-width: 960px; display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: calc(var(--nav-height) + var(--space-6)); }
.admin-toolbar { display: grid; grid-template-columns: 1fr auto; gap: var(--space-2); }
.admin-search { min-height: 46px; display: flex; align-items: center; gap: var(--space-2); padding: 0 var(--space-3); background: white; border-radius: var(--radius-md); }
.admin-search input { width: 100%; border: 0; outline: 0; background: transparent; }
.new-button { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 var(--space-4); background: var(--color-primary); color: white; border-radius: var(--radius-md); font-size: .8rem; font-weight: 900; }
.admin-filters { max-width: 260px; }
.admin-filters select { width: 100%; min-height: 44px; border: 0; outline: 0; padding: 0 var(--space-3); background: white; border-radius: var(--radius-md); }
.admin-count { color: var(--color-text-muted); font-size: .72rem; font-weight: 800; }
.admin-state { padding: var(--space-12); text-align: center; color: var(--color-text-muted); }
.admin-state--card { background: white; border-radius: var(--radius-lg); }
.kit-list { display: grid; gap: var(--space-3); }
.kit-card { display: grid; grid-template-columns: 112px 1fr; gap: var(--space-3); padding: var(--space-3); background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.kit-card > img, .kit-card__placeholder { width: 112px; height: 112px; border-radius: var(--radius-md); background: #fff1e8; }
.kit-card > img { object-fit: cover; }
.kit-card__placeholder { display: flex; align-items: center; justify-content: center; color: var(--color-primary-light); }
.kit-card__content { min-width: 0; display: flex; flex-direction: column; gap: var(--space-2); }
.kit-card__top { display: flex; justify-content: space-between; gap: var(--space-2); }
.kit-card__top p { color: #9a5d1c; font-size: .62rem; font-weight: 900; text-transform: uppercase; }
.kit-card__top h2 { font-size: .95rem; line-height: 1.2; }
.status-pill { flex: none; height: fit-content; padding: 3px 8px; border-radius: var(--radius-full); font-size: .62rem; font-weight: 900; }
.status-pill--active { background: #e5f6ea; color: #216b39; }
.status-pill--inactive { background: #eee; color: #666; }
.kit-card__items { color: var(--color-text-muted); font-size: .7rem; line-height: 1.35; }
.kit-card__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 5px 10px; color: var(--color-text-muted); font-size: .72rem; }
.kit-card__meta strong { color: var(--color-text); font-size: .85rem; }
.old-price { text-decoration: line-through; }
.kit-card__actions { margin-top: auto; display: flex; gap: var(--space-2); }
.kit-card__actions a, .kit-card__actions button { min-height: 34px; display: inline-flex; align-items: center; gap: 5px; padding: 0 10px; border-radius: var(--radius-full); font-size: .72rem; font-weight: 900; }
.kit-card__actions a { background: #fff3ed; }
.kit-card__actions button { color: #8a1f1f; background: #fde7e7; }
@media (min-width: 760px) { .kit-list { grid-template-columns: 1fr 1fr; } }
@media (max-width: 460px) { .admin-toolbar { grid-template-columns: 1fr; } .new-button { width: 100%; } .kit-card { grid-template-columns: 86px 1fr; } .kit-card > img, .kit-card__placeholder { width: 86px; height: 86px; } }
</style>
