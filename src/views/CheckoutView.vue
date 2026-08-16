<template>
  <div class="checkout-page">
    <PageHeader title="Finalizar pedido" fallback="/carrinho" />
    <main class="container checkout-page__content">
      <FeedbackMessage :message="orderStore.error" />
      <FeedbackMessage :message="addressStore.error" />

      <section v-if="cartStore.isEmpty" class="checkout-page__empty">
        <ShoppingCart :size="52" />
        <h2>Seu carrinho está vazio</h2>
        <AppButton @click="router.push('/')">Escolher produtos</AppButton>
      </section>

      <template v-else>
        <section class="checkout-section">
          <h2>1. Como deseja receber?</h2>
          <DeliveryMethodSelector v-model="deliveryMethod" />
        </section>

        <section class="checkout-section">
          <div class="checkout-section__heading">
            <h2>2. Endereço cadastrado</h2>
            <button type="button" @click="showAddressForm = !showAddressForm"><Plus :size="17" /> Novo</button>
          </div>

          <AddressForm
            v-if="showAddressForm"
            :loading="addressStore.saving"
            @submit="createAddress"
            @cancel="showAddressForm = false"
          />

          <div v-if="addressStore.loading" class="checkout-page__loading">Carregando endereços…</div>
          <div v-else-if="!addressStore.addresses.length && !showAddressForm" class="checkout-page__address-empty">
            <p>Cadastre ao menos um endereço antes de realizar o pedido, inclusive para retirada.</p>
            <AppButton variant="outline" @click="showAddressForm = true">Cadastrar endereço</AppButton>
          </div>
          <div v-else-if="deliveryMethod === 'delivery'" class="checkout-page__addresses">
            <AddressCard
              v-for="address in addressStore.addresses"
              :key="address.id"
              :address="address"
              selectable
              :selected="selectedAddressId === address.id"
              @select="selectedAddressId = $event"
            />
          </div>
          <p v-else class="checkout-page__pickup-note">O pedido será retirado no local. O endereço cadastrado é exigido apenas como informação do cliente e não será enviado no pedido.</p>
        </section>

        <section class="checkout-section">
          <h2>3. Forma de pagamento</h2>
          <PaymentMethodSelector v-model="paymentMethod" />
          <FeedbackMessage type="info" message="O backend atual registra a forma escolhida e cria o pagamento como pendente. Pix, cartão e boleto ainda não são processados automaticamente por um gateway." />
        </section>

        <section class="checkout-section">
          <h2>4. Observações</h2>
          <textarea v-model.trim="deliveryNotes" rows="3" maxlength="500" placeholder="Ex.: tocar a campainha, retirar às 18h…" />
        </section>

        <section class="checkout-section checkout-summary">
          <h2>Resumo do pedido</h2>
          <div v-for="item in cartStore.items" :key="`product-${item.product.id}`" class="checkout-summary__item">
            <span>{{ item.quantity }}× {{ item.product.name }}</span>
            <strong>{{ formatCurrency(Number(item.product.price) * item.quantity) }}</strong>
          </div>
          <div v-for="item in cartStore.kitItems" :key="`kit-${item.kit.id}`" class="checkout-summary__item checkout-summary__item--kit">
            <span>{{ item.quantity }}× {{ item.kit.name }} <small>Kit</small></span>
            <strong>{{ formatCurrency(Number(item.kit.promotional_price) * item.quantity) }}</strong>
          </div>
          <div class="checkout-summary__row"><span>Subtotal previsto</span><span>{{ formatCurrency(cartStore.totalPrice) }}</span></div>
          <div class="checkout-summary__row"><span>Taxa de entrega</span><span>Calculada pelo backend</span></div>
          <div class="checkout-summary__total"><span>Total previsto</span><strong>{{ formatCurrency(cartStore.totalPrice) }}</strong></div>
        </section>

        <AppButton size="lg" class="checkout-page__submit" :loading="orderStore.saving" :disabled="!canSubmit" @click="finishOrder">
          Confirmar pedido
        </AppButton>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, ShoppingCart } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import AppButton from '@/components/common/AppButton.vue'
import AddressCard from '@/components/address/AddressCard.vue'
import AddressForm from '@/components/address/AddressForm.vue'
import DeliveryMethodSelector from '@/components/checkout/DeliveryMethodSelector.vue'
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector.vue'
import { useAddressStore } from '@/stores/useAddressStore'
import { useCartStore } from '@/stores/useCartStore'
import { useOrderStore } from '@/stores/useOrderStore'
import { formatCurrency } from '@/utils/formatters'

const router = useRouter()
const cartStore = useCartStore()
const addressStore = useAddressStore()
const orderStore = useOrderStore()
const deliveryMethod = ref('delivery')
const paymentMethod = ref('pix')
const selectedAddressId = ref(null)
const deliveryNotes = ref('')
const showAddressForm = ref(false)

const canSubmit = computed(() =>
  cartStore.canCheckout &&
  addressStore.hasAddresses &&
  (deliveryMethod.value === 'pickup' || Boolean(selectedAddressId.value)) &&
  Boolean(paymentMethod.value),
)

watch(
  () => addressStore.defaultAddress,
  (address) => {
    if (!selectedAddressId.value && address) selectedAddressId.value = address.id
  },
  { immediate: true },
)

onMounted(async () => {
  try { await addressStore.fetchAddresses() } catch { /* store exibe erro */ }
  if (!addressStore.addresses.length) showAddressForm.value = true
})

async function createAddress(payload) {
  try {
    const address = await addressStore.createAddress(payload)
    selectedAddressId.value = address.id
    showAddressForm.value = false
  } catch { /* store exibe erro */ }
}

async function finishOrder() {
  if (!canSubmit.value) return
  const availability = await cartStore.refreshProducts()
  if (!availability.ok) {
    orderStore.error = 'Alguns itens mudaram de preço, estoque ou disponibilidade. Revise o carrinho antes de continuar.'
    router.push({ name: 'cart' })
    return
  }
  const payload = {
    delivery_method: deliveryMethod.value,
    address: deliveryMethod.value === 'delivery' ? selectedAddressId.value : null,
    delivery_notes: deliveryNotes.value,
    payment_method: paymentMethod.value,
    items: cartStore.items.map((item) => ({ product: item.product.id, quantity: item.quantity })),
    kits: cartStore.kitItems.map((item) => ({ kit: item.kit.id, quantity: item.quantity })),
  }
  try {
    const order = await orderStore.createOrder(payload)
    cartStore.clearCart()
    router.replace({ name: 'order-success', params: { id: order.id } })
  } catch { /* store exibe erro */ }
}
</script>

<style scoped>
.checkout-page { min-height: 100vh; }
.checkout-page__content { display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: var(--space-10); }
.checkout-page__empty { padding: var(--space-12); display: flex; flex-direction: column; align-items: center; gap: var(--space-3); text-align: center; color: var(--color-text-muted); }
.checkout-page__empty svg { color: var(--color-accent); }
.checkout-section { display: flex; flex-direction: column; gap: var(--space-3); }
.checkout-section > h2, .checkout-section__heading h2 { font-size: 1rem; }
.checkout-section__heading { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.checkout-section__heading button { display: flex; align-items: center; gap: 4px; color: var(--color-primary); font-size: .78rem; font-weight: 800; }
.checkout-page__addresses { display: flex; flex-direction: column; gap: var(--space-3); }
.checkout-page__loading, .checkout-page__pickup-note, .checkout-page__address-empty { color: var(--color-text-muted); font-size: .82rem; }
.checkout-page__address-empty { display: flex; flex-direction: column; gap: var(--space-3); background: white; padding: var(--space-4); border-radius: var(--radius-lg); }
.checkout-section textarea { width: 100%; border: 1.5px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-3); background: white; resize: vertical; outline: none; }
.checkout-section textarea:focus { border-color: var(--color-accent); }
.checkout-summary { background: white; padding: var(--space-5); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.checkout-summary__item, .checkout-summary__row, .checkout-summary__total { display: flex; justify-content: space-between; gap: var(--space-3); font-size: .82rem; }
.checkout-summary__item span { max-width: 70%; }
.checkout-summary__item--kit small { color: #9a5d1c; font-size: .62rem; font-weight: 900; text-transform: uppercase; }
.checkout-summary__row { color: var(--color-text-muted); }
.checkout-summary__total { padding-top: var(--space-3); border-top: 1px solid var(--color-border); font-size: 1rem; }
.checkout-page__submit { width: 100%; }
</style>
