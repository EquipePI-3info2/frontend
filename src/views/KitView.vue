<template>
  <div class="kit-page pb-nav">
    <PageHeader title="Kit promocional" fallback="/" />
    <main class="container kit-page__content">
      <div v-if="store.loading" class="kit-page__state">Carregando kit…</div>
      <div v-else-if="store.error" class="kit-page__state"><FeedbackMessage :message="store.error" /></div>
      <template v-else-if="kit">
        <div class="kit-page__image-wrap">
          <img v-if="kit.image_url && !imageFailed" :src="kit.image_url" :alt="kit.name" @error="imageFailed = true" />
          <div v-else class="kit-page__placeholder"><Gift :size="72" /></div>
          <span>Promoção</span>
        </div>

        <section class="kit-page__details">
          <p class="kit-page__eyebrow">Kit especial</p>
          <h1>{{ kit.name }}</h1>
          <p v-if="kit.description" class="kit-page__description">{{ kit.description }}</p>

          <div class="kit-page__prices">
            <span>{{ formatCurrency(kit.regular_price) }}</span>
            <strong>{{ formatCurrency(kit.promotional_price) }}</strong>
          </div>
          <p class="kit-page__saving">Você economiza {{ formatCurrency(kit.savings) }}</p>

          <section class="kit-page__items">
            <h2>O que vem no kit</h2>
            <div v-for="item in kit.items" :key="item.id" class="kit-product">
              <img v-if="item.product?.image_url" :src="item.product.image_url" :alt="item.product.name" />
              <div v-else class="kit-product__placeholder"><Package :size="22" /></div>
              <div><strong>{{ item.product?.name }}</strong><span>{{ item.quantity }} unidade(s)</span></div>
            </div>
          </section>

          <p :class="['kit-page__stock', { 'kit-page__stock--low': Number(kit.available_stock) <= 2 }]">
            {{ available ? `${kit.available_stock} kit(s) disponível(is)` : 'Kit indisponível no momento' }}
          </p>

          <FeedbackMessage :message="message" :type="messageType" />
          <div class="kit-page__purchase">
            <QuantitySelector v-model="quantity" :max="Math.max(1, Number(kit.available_stock || 0))" :disabled="!available" />
            <AppButton :disabled="!available" @click="add">Adicionar kit ao carrinho</AppButton>
          </div>
        </section>
      </template>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Gift, Package } from 'lucide-vue-next'
import AppButton from '@/components/common/AppButton.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import QuantitySelector from '@/components/common/QuantitySelector.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useCartStore } from '@/stores/useCartStore'
import { useKitStore } from '@/stores/useKitStore'
import { formatCurrency } from '@/utils/formatters'

const route = useRoute()
const store = useKitStore()
const cartStore = useCartStore()
const quantity = ref(1)
const message = ref('')
const messageType = ref('success')
const imageFailed = ref(false)
const kit = computed(() => store.selectedKit)
const available = computed(() => kit.value?.is_active !== false && kit.value?.is_in_stock && Number(kit.value?.available_stock) > 0)

async function load() {
  quantity.value = 1
  message.value = ''
  imageFailed.value = false
  try {
    const data = await store.fetchKit(route.params.slug)
    cartStore.syncKit(data)
  } catch { /* store exibe erro */ }
}

function add() {
  const result = cartStore.addKitToCart(kit.value, quantity.value)
  message.value = result.message || (result.ok ? 'Kit adicionado ao carrinho.' : 'Não foi possível adicionar o kit.')
  messageType.value = result.ok ? 'success' : 'error'
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<style scoped>
.kit-page { min-height: 100vh; }
.kit-page__content { padding-bottom: calc(var(--nav-height) + var(--space-6)); }
.kit-page__state { padding: var(--space-12); text-align: center; color: var(--color-text-muted); }
.kit-page__image-wrap { height: 320px; position: relative; overflow: hidden; border-radius: var(--radius-xl); background: #fff1e8; box-shadow: var(--shadow-sm); }
.kit-page__image-wrap img { width: 100%; height: 100%; object-fit: cover; }
.kit-page__placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--color-primary-light); }
.kit-page__image-wrap > span { position: absolute; right: var(--space-3); bottom: var(--space-3); background: var(--color-accent); color: var(--color-primary); padding: 6px 12px; border-radius: var(--radius-full); font-size: .72rem; font-weight: 900; }
.kit-page__details { display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-5) var(--space-1); }
.kit-page__eyebrow { color: var(--color-text-muted); text-transform: uppercase; font-size: .7rem; font-weight: 900; letter-spacing: .07em; }
.kit-page h1 { font-size: 1.55rem; line-height: 1.2; }
.kit-page__description { color: var(--color-text-muted); }
.kit-page__prices { display: flex; gap: var(--space-3); align-items: baseline; }
.kit-page__prices span { color: var(--color-text-muted); text-decoration: line-through; }
.kit-page__prices strong { font-size: 1.35rem; }
.kit-page__saving { color: #277044; font-size: .82rem; font-weight: 900; }
.kit-page__items { background: white; border-radius: var(--radius-lg); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); }
.kit-page__items h2 { font-size: .95rem; margin-bottom: var(--space-1); }
.kit-product { display: grid; grid-template-columns: 46px 1fr; align-items: center; gap: var(--space-3); padding-block: 6px; border-bottom: 1px solid var(--color-border); }
.kit-product:last-child { border-bottom: 0; }
.kit-product img, .kit-product__placeholder { width: 46px; height: 46px; border-radius: var(--radius-md); object-fit: cover; background: #f8eee8; }
.kit-product__placeholder { display: flex; align-items: center; justify-content: center; }
.kit-product div:last-child { display: flex; flex-direction: column; }
.kit-product strong { font-size: .82rem; }
.kit-product span { color: var(--color-text-muted); font-size: .72rem; }
.kit-page__stock { font-size: .8rem; font-weight: 900; color: #277044; }
.kit-page__stock--low { color: #9a5d1c; }
.kit-page__purchase { display: grid; grid-template-columns: auto 1fr; gap: var(--space-3); align-items: center; }
.kit-page__purchase :deep(.app-btn) { width: 100%; }
</style>
