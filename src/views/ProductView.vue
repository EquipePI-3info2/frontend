<template>
  <div class="product-page pb-nav">
    <PageHeader :title="product?.name || 'Produto'" fallback="/" />

    <main class="container product-page__content">
      <div v-if="store.loading" class="product-page__loading">Carregando produto…</div>
      <section v-else-if="store.error" class="product-page__state">
        <AlertCircle :size="48" />
        <h2>Produto não encontrado</h2>
        <p>{{ store.error }}</p>
        <AppButton variant="outline" @click="router.push('/')">Voltar à loja</AppButton>
      </section>

      <template v-else-if="product">
        <div class="product-page__image-wrap">
          <img :src="image" :alt="product.name" class="product-page__image" @error="imageFailed = true" />
          <span v-if="!available">Indisponível</span>
        </div>

        <section class="product-page__details">
          <p class="product-page__category">{{ categoryName }}<template v-if="product.flavor?.name"> · {{ product.flavor.name }}</template></p>
          <h1>{{ product.name }}</h1>
          <p class="product-page__price">{{ formatCurrency(product.price) }}</p>
          <p class="product-page__description">{{ product.description || 'Produto artesanal preparado com muito carinho.' }}</p>
          <p class="product-page__stock" :class="{ 'product-page__stock--low': Number(product.stock) <= 3 }">
            {{ available ? `${product.stock} unidade(s) disponível(is)` : 'Produto sem estoque' }}
          </p>

          <FeedbackMessage :message="message" :type="messageType" />

          <div class="product-page__purchase">
            <QuantitySelector v-model="quantity" :max="Math.max(1, Number(product.stock || 0))" :disabled="!available" />
            <AppButton size="lg" :disabled="!available" @click="addToCart">
              {{ available ? 'Adicionar ao carrinho' : 'Indisponível' }}
            </AppButton>
          </div>
          <AppButton v-if="cartStore.isInCart(product.id)" variant="outline" class="product-page__cart-link" @click="router.push('/carrinho')">
            Ver carrinho
          </AppButton>
        </section>
      </template>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import QuantitySelector from '@/components/common/QuantitySelector.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { resolveFallbackProductImage, resolveProductImage, useProductStore } from '@/stores/useProductStore'
import { useCartStore } from '@/stores/useCartStore'
import { formatCurrency } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const store = useProductStore()
const cartStore = useCartStore()
const quantity = ref(1)
const message = ref('')
const messageType = ref('success')
const imageFailed = ref(false)
const product = computed(() => store.selectedProduct)
const available = computed(() => product.value?.is_active !== false && product.value?.is_in_stock && Number(product.value?.stock) > 0)
const categoryName = computed(() => product.value?.category?.name || product.value?.category_name || '')
const image = computed(() =>
  imageFailed.value
    ? resolveFallbackProductImage(product.value)
    : resolveProductImage(product.value),
)

async function load() {
  quantity.value = 1
  message.value = ''
  imageFailed.value = false
  try {
    const data = await store.fetchProduct(route.params.slug)
    cartStore.syncProduct(data)
  } catch { /* estado tratado pela store */ }
}
onMounted(load)
watch(() => route.params.slug, load)

function addToCart() {
  const result = cartStore.addToCart(product.value, quantity.value)
  message.value = result.message || (result.ok ? 'Produto adicionado ao carrinho.' : 'Não foi possível adicionar o produto.')
  messageType.value = result.ok ? 'success' : 'error'
}
</script>

<style scoped>
.product-page { min-height: 100vh; }
.product-page__content { padding-bottom: var(--space-8); }
.product-page__loading, .product-page__state { padding: var(--space-12) var(--space-4); text-align: center; color: var(--color-text-muted); }
.product-page__state { display: flex; flex-direction: column; align-items: center; gap: var(--space-3); }
.product-page__state svg { color: var(--color-accent); }
.product-page__image-wrap { height: 330px; position: relative; overflow: hidden; border-radius: var(--radius-xl); background: #fdf3ee; box-shadow: var(--shadow-sm); }
.product-page__image { width: 100%; height: 100%; object-fit: cover; }
.product-page__image-wrap > span { position: absolute; right: var(--space-3); bottom: var(--space-3); background: var(--color-primary); color: white; padding: 6px 12px; border-radius: var(--radius-full); font-size: .75rem; font-weight: 800; }
.product-page__details { display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-5) var(--space-1); }
.product-page__category { color: var(--color-text-muted); text-transform: uppercase; font-size: .72rem; font-weight: 800; letter-spacing: .06em; }
.product-page__details h1 { font-size: 1.65rem; line-height: 1.15; }
.product-page__price { font-size: 1.3rem; font-weight: 900; }
.product-page__description { color: var(--color-text-muted); }
.product-page__stock { font-size: .8rem; font-weight: 800; color: #277044; }
.product-page__stock--low { color: #9a5d1c; }
.product-page__purchase { display: grid; grid-template-columns: auto 1fr; gap: var(--space-3); align-items: center; margin-top: var(--space-2); }
.product-page__purchase :deep(.app-btn) { width: 100%; }
.product-page__cart-link { width: 100%; }
</style>
