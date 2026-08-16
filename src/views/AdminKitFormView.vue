<template>
  <div class="admin-page">
    <PageHeader :title="isEditing ? 'Editar kit' : 'Novo kit'" fallback="/admin/kits" />
    <main class="container admin-page__content">
      <AdminNav />
      <FeedbackMessage :message="store.error" />

      <div v-if="loadingForm" class="admin-state">Carregando kit…</div>
      <form v-else class="kit-form" @submit.prevent="saveKit">
        <section class="form-card">
          <h2>Informações do kit</h2>
          <label><span>Nome *</span><input v-model.trim="form.name" required maxlength="150" /></label>
          <label><span>Descrição</span><textarea v-model.trim="form.description" rows="4" placeholder="Ex.: 2 cookies + 1 brownie com preço especial" /></label>
          <div class="switches">
            <label><input v-model="form.is_active" type="checkbox" />Kit ativo</label>
            <label><input v-model="form.is_featured" type="checkbox" />Exibir em destaque</label>
          </div>
        </section>

        <section class="form-card">
          <div class="section-heading">
            <div><h2>Produtos do kit</h2><p>Selecione os produtos e informe quantas unidades de cada entram em um kit.</p></div>
          </div>
          <div class="product-picker">
            <article v-for="product in store.products" :key="product.id" :class="['product-option', { 'product-option--selected': isSelected(product.id), 'product-option--disabled': !product.is_active }]">
              <label class="product-option__check">
                <input type="checkbox" :checked="isSelected(product.id)" :disabled="!product.is_active" @change="toggleProduct(product, $event.target.checked)" />
                <span><strong>{{ product.name }}</strong><small>{{ formatCurrency(product.price) }} · Estoque: {{ product.stock }}</small></span>
              </label>
              <label v-if="isSelected(product.id)" class="product-option__quantity"><span>Qtd.</span><input v-model.number="selectedProducts[product.id]" type="number" min="1" :max="Math.max(1, Number(product.stock || 1))" step="1" required /></label>
            </article>
          </div>
          <p v-if="!selectedItems.length" class="selection-warning">Selecione pelo menos um produto.</p>
        </section>

        <section class="form-card price-card">
          <h2>Preço da promoção</h2>
          <div class="price-summary"><span>Valor normal dos produtos</span><strong>{{ formatCurrency(regularPrice) }}</strong></div>
          <label><span>Preço promocional *</span><input v-model="form.promotional_price" type="number" min="0.01" step="0.01" required /></label>
          <div class="price-summary price-summary--saving"><span>Economia para o cliente</span><strong>{{ formatCurrency(savings) }}</strong></div>
          <p v-if="priceInvalid" class="selection-warning">O preço promocional precisa ser menor que {{ formatCurrency(regularPrice) }}.</p>
        </section>

        <section class="form-card image-card">
          <div><h2>Imagem do kit</h2><p>Você pode escolher uma imagem ou tirar uma foto do kit pronto.</p></div>
          <div v-if="displayImage" class="image-preview"><img :src="displayImage" alt="Prévia da imagem do kit" /></div>
          <div class="image-actions">
            <button type="button" @click="uploadInput?.click()"><ImagePlus :size="18" />Escolher imagem</button>
            <button type="button" @click="cameraInput?.click()"><Camera :size="18" />Tirar foto</button>
          </div>
          <input ref="uploadInput" class="hidden-input" type="file" accept="image/*" @change="handleImage" />
          <input ref="cameraInput" class="hidden-input" type="file" accept="image/*" capture="environment" @change="handleImage" />
        </section>

        <FeedbackMessage :message="message" :type="messageType" />
        <div class="form-actions">
          <AppButton type="submit" :loading="store.saving" :disabled="!canSubmit">{{ isEditing ? 'Salvar alterações' : 'Criar kit' }}</AppButton>
          <RouterLink :to="{ name: 'admin-kits' }">Cancelar</RouterLink>
        </div>
      </form>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Camera, ImagePlus } from 'lucide-vue-next'
import AdminNav from '@/components/admin/AdminNav.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import AppButton from '@/components/common/AppButton.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useAdminStore } from '@/stores/useAdminStore'
import { formatCurrency } from '@/utils/formatters'

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
const selectedProducts = reactive({})
const isEditing = computed(() => Boolean(route.params.slug))
const displayImage = computed(() => previewUrl.value || currentImage.value)

const form = reactive({
  name: '',
  description: '',
  promotional_price: '',
  is_active: true,
  is_featured: false,
})

const selectedItems = computed(() =>
  Object.entries(selectedProducts)
    .filter(([, quantity]) => Number(quantity) > 0)
    .map(([product, quantity]) => ({ product: Number(product), quantity: Number(quantity) })),
)

const regularPrice = computed(() => selectedItems.value.reduce((sum, item) => {
  const product = store.products.find((entry) => entry.id === item.product)
  return sum + Number(product?.price || 0) * item.quantity
}, 0))
const savings = computed(() => Math.max(0, regularPrice.value - Number(form.promotional_price || 0)))
const priceInvalid = computed(() => Number(form.promotional_price || 0) >= regularPrice.value && regularPrice.value > 0)
const canSubmit = computed(() => selectedItems.value.length > 0 && Number(form.promotional_price) > 0 && !priceInvalid.value)

function isSelected(productId) {
  return Object.prototype.hasOwnProperty.call(selectedProducts, productId)
}

function toggleProduct(product, checked) {
  if (checked) selectedProducts[product.id] = 1
  else delete selectedProducts[product.id]
}

function fillForm(kit) {
  form.name = kit.name || ''
  form.description = kit.description || ''
  form.promotional_price = kit.promotional_price ?? ''
  form.is_active = Boolean(kit.is_active)
  form.is_featured = Boolean(kit.is_featured)
  currentImage.value = kit.image_url || kit.image || ''
  Object.keys(selectedProducts).forEach((key) => delete selectedProducts[key])
  ;(kit.items || []).forEach((item) => {
    selectedProducts[item.product.id] = item.quantity
  })
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

function buildPayload() {
  const payload = new FormData()
  payload.append('name', form.name)
  payload.append('description', form.description)
  payload.append('promotional_price', form.promotional_price)
  payload.append('is_active', String(form.is_active))
  payload.append('is_featured', String(form.is_featured))
  payload.append('items_json', JSON.stringify(selectedItems.value))
  if (imageFile.value) payload.append('image', imageFile.value)
  return payload
}

async function saveKit() {
  if (!canSubmit.value) return
  message.value = ''
  try {
    const payload = buildPayload()
    if (isEditing.value) await store.updateKit(route.params.slug, payload)
    else await store.createKit(payload)
    router.push({ name: 'admin-kits' })
  } catch {
    message.value = store.error
    messageType.value = 'error'
  }
}

onMounted(async () => {
  try {
    await store.fetchCatalog()
    if (isEditing.value) fillForm(await store.fetchKit(route.params.slug))
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
.kit-form { display: flex; flex-direction: column; gap: var(--space-4); }
.form-card { display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-5); background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.form-card h2 { font-size: 1rem; }
.form-card label { display: flex; flex-direction: column; gap: 5px; font-size: .76rem; font-weight: 900; }
.form-card input:not([type='checkbox']), .form-card textarea { width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: white; outline: 0; resize: vertical; }
.form-card textarea { min-height: 96px; }
.switches { display: flex; flex-wrap: wrap; gap: var(--space-4); }
.switches label { flex-direction: row; align-items: center; font-size: .8rem; }
.switches input { width: 18px; height: 18px; accent-color: var(--color-primary); }
.section-heading p, .image-card > div:first-child p { color: var(--color-text-muted); font-size: .74rem; }
.product-picker { display: flex; flex-direction: column; gap: var(--space-2); max-height: 390px; overflow-y: auto; }
.product-option { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: var(--space-3); padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
.product-option--selected { border-color: var(--color-accent); background: #fff9f5; }
.product-option--disabled { opacity: .55; }
.product-option__check { flex-direction: row !important; align-items: center; gap: var(--space-3) !important; }
.product-option__check input { width: 18px; height: 18px; accent-color: var(--color-primary); }
.product-option__check span { display: flex; flex-direction: column; }
.product-option__check small { color: var(--color-text-muted); font-weight: 600; }
.product-option__quantity { width: 76px; }
.product-option__quantity input { min-height: 38px !important; padding: 6px 8px !important; }
.selection-warning { color: #9a2f2f; font-size: .73rem; font-weight: 800; }
.price-summary { display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); padding: var(--space-3); border-radius: var(--radius-md); background: #fff8f4; font-size: .8rem; }
.price-summary--saving strong { color: #277044; }
.image-preview { width: min(100%, 360px); aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius-lg); background: #f4ece7; }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }
.image-actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.image-actions button { min-height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 var(--space-4); border: 1px solid var(--color-primary); border-radius: var(--radius-full); font-size: .78rem; font-weight: 900; }
.hidden-input { display: none; }
.form-actions { display: flex; align-items: center; gap: var(--space-3); }
.form-actions > a { padding: 10px; font-size: .8rem; font-weight: 900; }
@media (max-width: 560px) { .product-option { grid-template-columns: 1fr; } .product-option__quantity { width: 100%; } .form-actions { flex-direction: column; align-items: stretch; } .form-actions > a { text-align: center; } }
</style>
