<template>
  <div class="admin-page">
    <PageHeader title="Sabores" fallback="/admin" />
    <main class="container admin-page__content">
      <AdminNav />
      <FeedbackMessage :message="message || store.error" :type="message ? messageType : 'error'" />

      <section class="form-card">
        <h2>{{ editingSlug ? 'Editar sabor' : 'Novo sabor' }}</h2>
        <form @submit.prevent="saveFlavor">
          <label><span>Nome *</span><input v-model.trim="form.name" required maxlength="100" /></label>
          <label><span>Descrição</span><textarea v-model.trim="form.description" rows="3" /></label>
          <label class="check-label"><input v-model="form.is_active" type="checkbox" />Sabor ativo</label>
          <div class="form-actions">
            <AppButton type="submit" size="sm" :loading="store.saving">{{ editingSlug ? 'Salvar' : 'Adicionar' }}</AppButton>
            <button v-if="editingSlug" type="button" class="cancel-button" @click="resetForm">Cancelar edição</button>
          </div>
        </form>
      </section>

      <div v-if="store.loading" class="admin-state">Carregando sabores…</div>
      <section v-else class="item-list">
        <article v-for="flavor in store.flavors" :key="flavor.id" class="item-card">
          <div class="item-card__body">
            <div><h3>{{ flavor.name }}</h3><p>{{ flavor.description || 'Sem descrição' }}</p></div>
            <span :class="['status-pill', flavor.is_active ? 'status-pill--active' : 'status-pill--inactive']">{{ flavor.is_active ? 'Ativo' : 'Inativo' }}</span>
          </div>
          <div class="item-card__actions">
            <button type="button" @click="startEdit(flavor)"><Pencil :size="16" />Editar</button>
            <button type="button" class="danger" @click="removeFlavor(flavor)"><Trash2 :size="16" />Excluir</button>
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
const form = reactive({ name: '', description: '', is_active: true })

function resetForm() {
  editingSlug.value = ''
  form.name = ''
  form.description = ''
  form.is_active = true
}

function startEdit(flavor) {
  editingSlug.value = flavor.slug
  form.name = flavor.name
  form.description = flavor.description || ''
  form.is_active = Boolean(flavor.is_active)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function saveFlavor() {
  message.value = ''
  const payload = { ...form }
  try {
    if (editingSlug.value) await store.updateFlavor(editingSlug.value, payload)
    else await store.createFlavor(payload)
    resetForm()
    await store.fetchCatalog()
    message.value = 'Sabor salvo com sucesso.'
    messageType.value = 'success'
  } catch {
    message.value = store.error
    messageType.value = 'error'
  }
}

async function removeFlavor(flavor) {
  if (!window.confirm(`Excluir o sabor “${flavor.name}”?`)) return
  message.value = ''
  try {
    await store.deleteFlavor(flavor.slug)
    if (editingSlug.value === flavor.slug) resetForm()
    await store.fetchCatalog()
    message.value = 'Sabor excluído.'
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
.check-label { min-height: 44px; flex-direction: row !important; align-items: center; }
.check-label input { width: 18px; height: 18px; accent-color: var(--color-primary); }
.form-actions, .item-card__actions { display: flex; gap: var(--space-2); }
.cancel-button { padding: 0 12px; font-size: .75rem; font-weight: 900; }
.item-list { display: flex; flex-direction: column; gap: var(--space-3); }
.item-card { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
.item-card__body { display: flex; align-items: start; justify-content: space-between; gap: var(--space-3); }
.item-card h3 { font-size: .9rem; }
.item-card p { margin-top: 2px; color: var(--color-text-muted); font-size: .7rem; }
.status-pill { flex: none; padding: 3px 8px; border-radius: var(--radius-full); font-size: .62rem; font-weight: 900; }
.status-pill--active { color: #216b39; background: #e5f6ea; }
.status-pill--inactive { color: #666; background: #eee; }
.item-card__actions button { min-height: 34px; display: inline-flex; align-items: center; gap: 5px; padding: 0 10px; border-radius: var(--radius-full); background: #fff3ed; font-size: .72rem; font-weight: 900; }
.item-card__actions .danger { color: #8a1f1f; background: #fde7e7; }
</style>
