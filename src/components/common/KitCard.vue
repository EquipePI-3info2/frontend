<template>
  <article class="kit-card fade-in-up" :style="{ animationDelay: `${index * 45}ms` }" @click="goToKit">
    <div class="kit-card__image-wrap">
      <img v-if="kit.image_url && !imageFailed" :src="kit.image_url" :alt="kit.name" class="kit-card__image" @error="imageFailed = true" />
      <div v-else class="kit-card__placeholder"><Gift :size="42" /></div>
      <span class="kit-card__badge">Promoção</span>
      <span v-if="!available" class="kit-card__stock-label">Esgotado</span>
    </div>

    <div class="kit-card__body">
      <p class="kit-card__eyebrow">Kit</p>
      <h3>{{ kit.name }}</h3>
      <p class="kit-card__contents">{{ contents }}</p>
      <div class="kit-card__prices">
        <span>{{ formatCurrency(kit.regular_price) }}</span>
        <strong>{{ formatCurrency(kit.promotional_price) }}</strong>
      </div>
      <p v-if="Number(kit.savings) > 0" class="kit-card__saving">Economize {{ formatCurrency(kit.savings) }}</p>
      <AppButton variant="accent" size="sm" :disabled="!available" @click.stop="add">
        {{ !available ? 'indisponível' : added ? '✓ adicionado' : 'adicionar kit' }}
      </AppButton>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Gift } from 'lucide-vue-next'
import AppButton from '@/components/common/AppButton.vue'
import { useCartStore } from '@/stores/useCartStore'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({
  kit: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const router = useRouter()
const cartStore = useCartStore()
const added = ref(false)
const imageFailed = ref(false)
const available = computed(() => props.kit.is_active !== false && props.kit.is_in_stock && Number(props.kit.available_stock) > 0)
const contents = computed(() =>
  (props.kit.items || [])
    .map((item) => `${item.quantity} ${item.product?.name || 'produto'}`)
    .join(' + '),
)

function add() {
  const result = cartStore.addKitToCart(props.kit)
  if (!result.ok) return
  added.value = true
  window.setTimeout(() => (added.value = false), 1600)
}

function goToKit() {
  router.push({ name: 'kit', params: { slug: props.kit.slug } })
}
</script>

<style scoped>
.kit-card { background: white; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); cursor: pointer; display: flex; flex-direction: column; }
.kit-card:active { transform: scale(.98); }
.kit-card__image-wrap { position: relative; height: 156px; overflow: hidden; background: #fff1e8; }
.kit-card__image { width: 100%; height: 100%; object-fit: cover; }
.kit-card__placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--color-primary-light); }
.kit-card__badge, .kit-card__stock-label { position: absolute; top: 10px; padding: 4px 9px; border-radius: var(--radius-full); font-size: .62rem; font-weight: 900; }
.kit-card__badge { left: 10px; background: var(--color-accent); color: var(--color-primary); }
.kit-card__stock-label { right: 10px; background: rgba(59,26,8,.88); color: white; }
.kit-card__body { padding: var(--space-3); display: flex; flex-direction: column; gap: 5px; flex: 1; }
.kit-card__eyebrow { color: var(--color-text-muted); font-size: .64rem; text-transform: uppercase; font-weight: 900; letter-spacing: .06em; }
.kit-card h3 { font-size: .95rem; line-height: 1.25; }
.kit-card__contents { color: var(--color-text-muted); font-size: .7rem; line-height: 1.3; min-height: 1.8em; }
.kit-card__prices { display: flex; align-items: baseline; gap: 7px; flex-wrap: wrap; }
.kit-card__prices span { color: var(--color-text-muted); font-size: .72rem; text-decoration: line-through; }
.kit-card__prices strong { font-size: 1rem; }
.kit-card__saving { color: #277044; font-size: .68rem; font-weight: 900; margin-bottom: 3px; }
.kit-card :deep(.app-btn) { width: 100%; margin-top: auto; }
</style>
