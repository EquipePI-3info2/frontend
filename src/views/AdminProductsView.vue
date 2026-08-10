<template>
  <div class="admin-page">
    <PageHeader title="Produtos" fallback="/admin" />
    <main class="container admin-page__content">
      <AdminNav />

      <div class="admin-toolbar">
        <div class="admin-search"><Search :size="18" /><input v-model.trim="search" placeholder="Buscar produto" /></div>
        <RouterLink class="new-button" :to="{ name: 'admin-product-new' }"><Plus :size="18" />Novo produto</RouterLink>
      </div>

      <div class="admin-filters">
        <select v-model="category">
          <option value="">Todas as categorias</option>
          <option v-for="item in store.categories" :key="item.id" :value="item.slug">{{ item.name }}</option>
        </select>
        <select v-model="visibility">
          <option value="">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="out">Sem estoque</option>
        </select>
      </div>

      <FeedbackMessage :message="message || store.error" :type="message ? messageType : 'error'" />
      <p class="admin-count">{{ filteredProducts.length }} produto(s)</p>

      <div v-if="store.loading" class="admin-state">Carregando produtos…</div>
      <section v-else-if="!filteredProducts.length" class="admin-state admin-state--card">Nenhum produto encontrado.</section>
      <section v-else class="product-list">
        <article v-for="product in filteredProducts" :key="product.id" class="product-card">
          <img :src="resolveProductImage(product)" :alt="product.name" @error="useFallback($event, product)" />
          <div class="product-card__content">
            <div class="product-card__top">
              <div><p>{{ product.category_name || product.category?.name }}</p><h2>{{ product.name }}</h2></div>
              <span :class="['status-pill', product.is_active ? 'status-pill--active' : 'status-pill--inactive']">{{ product.is_active ? 'Ativo' : 'Inativo' }}</span>
            </div>
            <div class="product-card__meta">
              <span>{{ formatCurrency(product.price) }}</span>
              <span>{{ product.stock }} un.</span>
              <span v-if="product.flavor">{{ product.flavor.name }}</span>
            </div>
            <div class="product-card__actions">
              <RouterLink :to="{ name: 'admin-product-edit', params: { slug: product.slug } }"><Pencil :size="16" />Editar</RouterLink>
              <button type="button" @click="removeProduct(product)"><Trash2 :size="16" />Excluir</button>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Pencil, Plus, Search, Trash2 } from 'lucide-vue-next'
import AdminNav from '@/components/admin/AdminNav.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { resolveFallbackProductImage, resolveProductImage } from '@/stores/useProductStore'
import { useAdminStore } from '@/stores/useAdminStore'
import { formatCurrency } from '@/utils/formatters'

const store = useAdminStore()
const search = ref('')
const category = ref('')
const visibility = ref('')
const message = ref('')
const messageType = ref('success')

const filteredProducts = computed(() => {
  const term = search.value.toLowerCase()
  return store.products.filter((product) => {
    const matchesSearch = !term || [product.name, product.description, product.flavor?.name]
      .some((value) => String(value || '').toLowerCase().includes(term))
    const categorySlug = product.category_slug || product.category?.slug || ''
    const matchesCategory = !category.value || categorySlug === category.value
    const matchesVisibility = !visibility.value
      || (visibility.value === 'active' && product.is_active)
      || (visibility.value === 'inactive' && !product.is_active)
      || (visibility.value === 'out' && Number(product.stock || 0) === 0)
    return matchesSearch && matchesCategory && matchesVisibility
  })
})

function useFallback(event, product) {
  event.target.src = resolveFallbackProductImage(product)
}

async function removeProduct(product) {
  if (!window.confirm(`Excluir o produto “${product.name}”?`)) return
  message.value = ''
  try {
    await store.deleteProduct(product.slug)
    await store.fetchCatalog()
    message.value = 'Produto excluído.'
    messageType.value = 'success'
  } catch {
    message.value = store.error
    messageType.value = 'error'
  }
}

onMounted(() => store.fetchCatalog().catch(() => {}))
</script>

<style scoped>
.admin-page { min-height: 100vh; background: #f8f2ed; }
.admin-page__content { max-width: 960px; display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: var(--space-10); }
.admin-toolbar { display: grid; grid-template-columns: 1fr auto; gap: var(--space-2); }
.admin-search { min-height: 46px; display: flex; align-items: center; gap: var(--space-2); padding: 0 var(--space-3); background: white; border-radius: var(--radius-md); }
.admin-search input { width: 100%; border: 0; outline: 0; background: transparent; }
.new-button { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 var(--space-4); background: var(--color-primary); color: white; border-radius: var(--radius-md); font-size: .8rem; font-weight: 900; }
.admin-filters { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
.admin-filters select { min-height: 44px; border: 0; outline: 0; padding: 0 var(--space-3); background: white; border-radius: var(--radius-md); }
.admin-count { color: var(--color-text-muted); font-size: .72rem; font-weight: 800; }
.admin-state { padding: var(--space-12); text-align: center; color: var(--color-text-muted); }
.admin-state--card { background: white; border-radius: var(--radius-lg); }
.product-list { display: grid; gap: var(--space-3); }
.product-card { display: grid; grid-template-columns: 100px 1fr; gap: var(--space-3); padding: var(--space-3); background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.product-card > img { width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius-md); background: #f4ece7; }
.product-card__content { min-width: 0; display: flex; flex-direction: column; gap: var(--space-2); }
.product-card__top { display: flex; justify-content: space-between; gap: var(--space-2); }
.product-card__top p { color: var(--color-text-muted); font-size: .66rem; }
.product-card__top h2 { font-size: .9rem; line-height: 1.2; }
.status-pill { flex: none; height: fit-content; padding: 3px 8px; border-radius: var(--radius-full); font-size: .62rem; font-weight: 900; }
.status-pill--active { background: #e5f6ea; color: #216b39; }
.status-pill--inactive { background: #eee; color: #666; }
.product-card__meta { display: flex; flex-wrap: wrap; gap: 6px 12px; color: var(--color-text-muted); font-size: .72rem; }
.product-card__actions { margin-top: auto; display: flex; gap: var(--space-2); }
.product-card__actions a, .product-card__actions button { min-height: 34px; display: inline-flex; align-items: center; gap: 5px; padding: 0 10px; border-radius: var(--radius-full); font-size: .72rem; font-weight: 900; }
.product-card__actions a { background: #fff3ed; }
.product-card__actions button { color: #8a1f1f; background: #fde7e7; }
@media (min-width: 720px) { .product-list { grid-template-columns: 1fr 1fr; } }
@media (max-width: 460px) { .admin-toolbar { grid-template-columns: 1fr; } .new-button { width: 100%; } .product-card { grid-template-columns: 82px 1fr; } .product-card > img { width: 82px; height: 82px; } }
</style>
