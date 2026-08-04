<template>
  <div class="cart-page pb-nav">
    <PageHeader title="Meu carrinho" fallback="/" />

    <main class="container cart-page__content">
      <FeedbackMessage :message="message" :type="messageType" />

      <section v-if="cartStore.isEmpty" class="cart-page__empty">
        <ShoppingBag :size="58" />
        <h2>Seu carrinho está vazio</h2>
        <p>Escolha seus cookies e brownies favoritos para começar.</p>
        <AppButton @click="router.push('/')">Ver produtos</AppButton>
      </section>

      <template v-else>
        <div class="cart-page__heading">
          <p>{{ cartStore.totalItems }} item(ns)</p>
          <button type="button" @click="confirmClear">Limpar carrinho</button>
        </div>

        <div class="cart-page__items">
          <CartItem
            v-for="item in cartStore.items"
            :key="item.product.id"
            :item="item"
            @remove="cartStore.removeFromCart(item.product.id)"
            @update-quantity="updateQuantity(item.product.id, $event)"
          />
        </div>

        <FeedbackMessage
          v-if="cartStore.hasUnavailableItems"
          type="error"
          message="Revise os itens indisponíveis antes de continuar. Você pode removê-los ou ajustar a quantidade."
        />

        <CartSummary
          :total-items="cartStore.totalItems"
          :total-price="cartStore.totalPrice"
          :disabled="!cartStore.canCheckout"
          @checkout="goToCheckout"
        />
      </template>
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingBag } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import AppButton from '@/components/common/AppButton.vue'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCartStore } from '@/stores/useCartStore'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const message = ref('')
const messageType = ref('info')

onMounted(async () => {
  await cartStore.refreshProducts()
})

function updateQuantity(productId, quantity) {
  const result = cartStore.updateQuantity(productId, quantity)
  if (result.message) {
    message.value = result.message
    messageType.value = 'info'
  }
}
function confirmClear() {
  if (window.confirm('Deseja remover todos os itens do carrinho?')) cartStore.clearCart()
}
function goToCheckout() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: '/checkout' } })
    return
  }
  router.push({ name: 'checkout' })
}
</script>

<style scoped>
.cart-page { min-height: 100vh; }
.cart-page__content { display: flex; flex-direction: column; gap: var(--space-4); padding-top: var(--space-2); padding-bottom: var(--space-8); }
.cart-page__empty { margin-top: var(--space-8); display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-3); color: var(--color-text-muted); }
.cart-page__empty svg { color: var(--color-accent); }
.cart-page__empty h2 { color: var(--color-text); }
.cart-page__empty p { max-width: 30ch; }
.cart-page__heading { display: flex; justify-content: space-between; align-items: center; font-size: .82rem; color: var(--color-text-muted); }
.cart-page__heading button { color: #9a2f2f; font-weight: 800; }
.cart-page__items { display: flex; flex-direction: column; gap: var(--space-3); }
</style>
