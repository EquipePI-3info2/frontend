<template>
  <div class="admin-page">
    <PageHeader title="Categorias" fallback="/admin" />
    <main class="container admin-page__content">
      <AdminNav />
      <FeedbackMessage :message="message || store.error" :type="message ? messageType : 'error'" />

      <section class="form-card">
        <h2>{{ editingSlug ? 'Editar categoria' : 'Nova categoria' }}</h2>
        <form @submit.prevent="saveCategory">
          <label><span>Nome *</span><input v-model.trim="form.name" required maxlength="150" /></label>
          <label><span>Descrição</span><textarea v-model.trim="form.description" rows="3" /></label>
          <div class="form-grid">
            <label>
              <span>Posição de exibição</span>
              <input v-model="form.order" type="number" min="0" step="1" />
              <small>Define a posição da categoria no catálogo. Quanto menor o número, mais cedo ela aparece.</small>
            </label>
            <label class="check-label"><input v-model="form.is_active" type="checkbox" />Categoria ativa</label>
          </div>
          <div class="form-actions">
            <AppButton type="submit" size="sm" :loading="store.saving">{{ editingSlug ? 'Salvar' : 'Adicionar' }}</AppButton>
            <button v-if="editingSlug" type="button" class="cancel-button" @click="resetForm">Cancelar edição</button>
          </div>
        </form>
      </section>

      <div v-if="store.loading" class="admin-state">Carregando categorias…</div>
      <section v-else class="item-list">
        <article v-for="category in store.categories" :key="category.id" class="item-card">
          <div class="item-card__body">
            <div>
              <h3>{{ category.name }}</h3>
              <p>{{ category.product_count }} produto(s) · posição {{ category.order }}</p>
            </div>
            <span :class="['status-pill', category.is_active ? 'status-pill--active' : 'status-pill--inactive']">{{ category.is_active ? 'Ativa' : 'Inativa' }}</span>
          </div>
          <div class="item-card__actions">
            <button type="button" @click="startEdit(category)"><Pencil :size="16" />Editar</button>
            <button type="button" class="danger" @click="removeCategory(category)"><Trash2 :size="16" />Excluir</button>
          </div>
        </article>
      </section>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import AdminNav from '@/components/admin/AdminNav.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import AppButton from '@/components/common/AppButton.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useAdminStore } from '@/stores/useAdminStore'

const store = useAdminStore()
const editingSlug = ref('')
const message = ref('')
const messageType = ref('success')
const form = reactive({ name: '', description: '', order: 0, is_active: true })

function resetForm() {
  editingSlug.value = ''
  form.name = ''
  form.description = ''
  form.order = 0
  form.is_active = true
}

function startEdit(category) {
  resetForm()
  editingSlug.value = category.slug
  form.name = category.name
  form.description = category.description || ''
  form.order = category.order ?? 0
  form.is_active = Boolean(category.is_active)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function payload() {
  return {
    name: form.name,
    description: form.description,
    order: Number(form.order || 0),
    is_active: Boolean(form.is_active),
  }
}

async function saveCategory() {
  message.value = ''
  try {
    if (editingSlug.value) await store.updateCategory(editingSlug.value, payload())
    else await store.createCategory(payload())
    resetForm()
    await store.fetchCatalog()
    message.value = 'Categoria salva com sucesso.'
    messageType.value = 'success'
  } catch {
    message.value = store.error
    messageType.value = 'error'
  }
}

async function removeCategory(category) {
  if (!window.confirm(`Excluir a categoria “${category.name}”?`)) return
  message.value = ''
  try {
    await store.deleteCategory(category.slug)
    if (editingSlug.value === category.slug) resetForm()
    await store.fetchCatalog()
    message.value = 'Categoria excluída.'
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
.admin-page__content { max-width: 760px; display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: calc(var(--nav-height) + var(--space-6)); }
.admin-state { padding: var(--space-12); text-align: center; color: var(--color-text-muted); }
.form-card, .item-card { background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.form-card { padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); }
.form-card h2 { font-size: 1rem; }
.form-card form { display: flex; flex-direction: column; gap: var(--space-3); }
.form-card label { display: flex; flex-direction: column; gap: 5px; font-size: .76rem; font-weight: 900; }
.form-card input:not([type='checkbox']), .form-card textarea { width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md); outline: 0; resize: vertical; }
.form-card small { color: var(--color-text-muted); font-size: .66rem; font-weight: 600; line-height: 1.4; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; align-items: end; gap: var(--space-3); }
.check-label { min-height: 44px; flex-direction: row !important; align-items: center; }
.check-label input { width: 18px; height: 18px; accent-color: var(--color-primary); }
.form-actions { display: flex; gap: var(--space-2); }
.cancel-button { padding: 0 12px; font-size: .75rem; font-weight: 900; }
.item-list { display: flex; flex-direction: column; gap: var(--space-3); }
.item-card { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
.item-card__body { display: flex; align-items: start; justify-content: space-between; gap: var(--space-2); }
.item-card h3 { font-size: .9rem; }
.item-card p { color: var(--color-text-muted); font-size: .7rem; }
.status-pill { flex: none; padding: 3px 8px; border-radius: var(--radius-full); font-size: .62rem; font-weight: 900; }
.status-pill--active { color: #216b39; background: #e5f6ea; }
.status-pill--inactive { color: #666; background: #eee; }
.item-card__actions { display: flex; gap: var(--space-2); }
.item-card__actions button { min-height: 34px; display: inline-flex; align-items: center; gap: 5px; padding: 0 10px; border-radius: var(--radius-full); background: #fff3ed; font-size: .72rem; font-weight: 900; }
.item-card__actions .danger { color: #8a1f1f; background: #fde7e7; }
@media (max-width: 520px) { .form-grid { grid-template-columns: 1fr; } }
</style>
