<template>
  <div class="admin-page">
    <PageHeader :title="isEditing ? 'Editar produto' : 'Novo produto'" fallback="/admin/produtos" />
    <main class="container admin-page__content">
      <AdminNav />
      <FeedbackMessage :message="store.error" />

      <div v-if="loadingForm" class="admin-state">Carregando produto…</div>
      <form v-else class="product-form" @submit.prevent="saveProduct">
        <section class="form-card">
          <h2>Informações do produto</h2>
          <label><span>Nome *</span><input v-model.trim="form.name" required maxlength="150" /></label>
          <label><span>Descrição</span><textarea v-model.trim="form.description" rows="4" /></label>
          <div class="form-grid">
            <label><span>Categoria *</span><select v-model="form.category" required><option value="" disabled>Selecione</option><option v-for="item in store.categories" :key="item.id" :value="String(item.id)">{{ item.name }}</option></select></label>
            <label><span>Sabor</span><select v-model="form.flavor"><option value="">Sem sabor</option><option v-for="item in store.flavors" :key="item.id" :value="String(item.id)">{{ item.name }}</option></select></label>
          </div>
          <div class="form-grid">
            <label><span>Preço de venda *</span><input v-model="form.price" type="number" min="0.01" step="0.01" required /></label>
            <label><span>Preço de custo</span><input v-model="form.cost_price" type="number" min="0" step="0.01" /></label>
          </div>
          <label><span>Estoque</span><input v-model="form.stock" type="number" min="0" step="1" required /></label>
          <div class="switches">
            <label><input v-model="form.is_active" type="checkbox" />Produto ativo</label>
            <label><input v-model="form.is_featured" type="checkbox" />Produto em destaque</label>
          </div>
        </section>

        <section class="form-card image-card">
          <div><h2>Imagem</h2><p>Você pode escolher uma imagem ou tirar uma foto do produto.</p></div>
          <div v-if="displayImage" class="image-preview"><img :src="displayImage" alt="Prévia da imagem do produto" /></div>
          <div class="image-actions">
            <button type="button" @click="uploadInput?.click()"><ImagePlus :size="18" />Escolher imagem</button>
            <button type="button" @click="cameraInput?.click()"><Camera :size="18" />Tirar foto</button>
            <button v-if="imageFile" type="button" class="image-actions__remove" @click="removeSelectedImage"><Trash2 :size="18" />Remover imagem</button>
          </div>
          <input ref="uploadInput" class="hidden-input" type="file" accept="image/*" @change="handleImage" />
          <input ref="cameraInput" class="hidden-input" type="file" accept="image/*" capture="environment" @change="handleImage" />
          <small>JPG, PNG ou WEBP. No celular, “Tirar foto” solicita a câmera traseira.</small>
        </section>

        <FeedbackMessage :message="message" :type="messageType" />
        <div class="form-actions">
          <AppButton type="submit" :loading="store.saving">{{ isEditing ? 'Salvar alterações' : 'Cadastrar produto' }}</AppButton>
          <RouterLink :to="{ name: 'admin-products' }">Cancelar</RouterLink>
        </div>
      </form>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Camera, ImagePlus, Trash2 } from 'lucide-vue-next'
import AdminNav from '@/components/admin/AdminNav.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import AppButton from '@/components/common/AppButton.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useAdminStore } from '@/stores/useAdminStore'

const route = useRoute()
const router = useRouter()
const store = useAdminStore()
const uploadInput = ref(null)
const cameraInput = ref(null)
const imageFile = ref(null)
const previewUrl = ref('')
const currentImage = ref('')
const loadingForm = ref(true)
const message = ref('')
const messageType = ref('success')
const isEditing = computed(() => Boolean(route.params.slug))
const displayImage = computed(() => previewUrl.value || currentImage.value)

const form = reactive({
  name: '', description: '', category: '', flavor: '', price: '', cost_price: '', stock: 0,
  is_active: true, is_featured: false,
})

function fillForm(product) {
  form.name = product.name || ''
  form.description = product.description || ''
  form.category = String(product.category?.id ?? product.category ?? '')
  form.flavor = String(product.flavor?.id ?? '')
  form.price = product.price ?? ''
  form.cost_price = product.cost_price ?? ''
  form.stock = product.stock ?? 0
  form.is_active = Boolean(product.is_active)
  form.is_featured = Boolean(product.is_featured)
  currentImage.value = product.image_url || product.image || ''
}

function clearPreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

function handleImage(event) {
  const file = event.target.files?.[0]
  if (!file) return
  clearPreview()
  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  event.target.value = ''
}

function removeSelectedImage() {
  clearPreview()
  imageFile.value = null
  if (uploadInput.value) uploadInput.value.value = ''
  if (cameraInput.value) cameraInput.value.value = ''
}

function buildPayload() {
  const payload = new FormData()
  payload.append('name', form.name)
  payload.append('description', form.description)
  payload.append('category', form.category)
  payload.append('flavor', form.flavor)
  payload.append('price', form.price)
  if (form.cost_price !== '') payload.append('cost_price', form.cost_price)
  else payload.append('cost_price', '')
  payload.append('stock', String(form.stock))
  payload.append('is_active', String(form.is_active))
  payload.append('is_featured', String(form.is_featured))
  if (imageFile.value) payload.append('image', imageFile.value)
  return payload
}

async function saveProduct() {
  message.value = ''
  try {
    const payload = buildPayload()
    if (isEditing.value) await store.updateProduct(route.params.slug, payload)
    else await store.createProduct(payload)
    router.push({ name: 'admin-products' })
  } catch {
    message.value = store.error
    messageType.value = 'error'
  }
}

onMounted(async () => {
  try {
    await store.fetchCatalog()
    if (isEditing.value) fillForm(await store.fetchProduct(route.params.slug))
  } catch {
    message.value = store.error
    messageType.value = 'error'
  } finally {
    loadingForm.value = false
  }
})

onBeforeUnmount(clearPreview)
</script>

<style scoped>
.admin-page { min-height: 100vh; background: #f8f2ed; }
.admin-page__content { max-width: 760px; display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: calc(var(--nav-height) + var(--space-6)); }
.admin-state { padding: var(--space-12); text-align: center; color: var(--color-text-muted); }
.product-form { display: flex; flex-direction: column; gap: var(--space-4); }
.form-card { display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-5); background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.form-card h2 { font-size: 1rem; }
.form-card label { display: flex; flex-direction: column; gap: 5px; font-size: .76rem; font-weight: 900; }
.form-card input:not([type='checkbox']), .form-card select, .form-card textarea { width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: white; outline: 0; resize: vertical; }
.form-card textarea { min-height: 100px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.switches { display: flex; flex-wrap: wrap; gap: var(--space-4); }
.switches label { flex-direction: row; align-items: center; font-size: .8rem; }
.switches input { width: 18px; height: 18px; accent-color: var(--color-primary); }
.image-card > div:first-child p { color: var(--color-text-muted); font-size: .75rem; }
.image-preview { width: min(100%, 360px); aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius-lg); background: #f4ece7; }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }
.image-actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.image-actions button { min-height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 var(--space-4); border: 1px solid var(--color-primary); border-radius: var(--radius-full); font-size: .78rem; font-weight: 900; }
.image-actions .image-actions__remove { border-color: #a33c3c; color: #a33c3c; }
.hidden-input { display: none; }
.image-card small { color: var(--color-text-muted); font-size: .68rem; }
.form-actions { display: flex; align-items: center; gap: var(--space-3); }
.form-actions > a { padding: 10px; font-size: .8rem; font-weight: 900; }
@media (max-width: 560px) { .form-grid { grid-template-columns: 1fr; } .form-actions { flex-direction: column; align-items: stretch; } .form-actions > a { text-align: center; } }
</style>
