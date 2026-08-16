<template>
  <div class="addresses-page pb-nav">
    <PageHeader title="Meus endereços" fallback="/perfil">
      <button class="addresses-page__add-icon" type="button" aria-label="Cadastrar endereço" @click="openCreate"><Plus :size="21" /></button>
    </PageHeader>

    <main class="container addresses-page__content">
      <FeedbackMessage :message="store.error" />
      <FeedbackMessage :message="success" type="success" />

      <AddressForm
        v-if="formOpen"
        :address="editingAddress"
        :loading="store.saving"
        @submit="saveAddress"
        @cancel="closeForm"
      />

      <div v-if="store.loading" class="addresses-page__state">Carregando endereços…</div>
      <section v-else-if="!store.addresses.length && !formOpen" class="addresses-page__empty">
        <MapPin :size="52" />
        <h2>Nenhum endereço cadastrado</h2>
        <p>Cadastre um endereço para realizar seus pedidos.</p>
        <AppButton @click="openCreate">Cadastrar endereço</AppButton>
      </section>

      <section v-else class="addresses-page__list">
        <AddressCard
          v-for="address in store.addresses"
          :key="address.id"
          :address="address"
          editable
          @edit="openEdit"
          @delete="removeAddress"
        />
      </section>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { MapPin, Plus } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import AppButton from '@/components/common/AppButton.vue'
import AddressCard from '@/components/address/AddressCard.vue'
import AddressForm from '@/components/address/AddressForm.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useAddressStore } from '@/stores/useAddressStore'

const store = useAddressStore()
const formOpen = ref(false)
const editingAddress = ref(null)
const success = ref('')

onMounted(() => store.fetchAddresses().catch(() => {}))
function openCreate() { editingAddress.value = null; success.value = ''; formOpen.value = true }
function openEdit(address) { editingAddress.value = address; success.value = ''; formOpen.value = true; window.scrollTo({ top: 0, behavior: 'smooth' }) }
function closeForm() { formOpen.value = false; editingAddress.value = null }
async function saveAddress(payload) {
  try {
    if (editingAddress.value?.id) {
      await store.updateAddress(editingAddress.value.id, payload)
      success.value = 'Endereço atualizado com sucesso.'
    } else {
      await store.createAddress(payload)
      success.value = 'Endereço cadastrado com sucesso.'
    }
    closeForm()
  } catch { /* store exibe erro */ }
}
async function removeAddress(address) {
  if (!window.confirm(`Deseja excluir o endereço “${address.label || address.street}”?`)) return
  try {
    await store.deleteAddress(address.id)
    success.value = 'Endereço excluído.'
  } catch { /* store exibe erro */ }
}
</script>

<style scoped>
.addresses-page { min-height: 100vh; }
.addresses-page__add-icon { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); }
.addresses-page__content { display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: var(--space-8); }
.addresses-page__state { text-align: center; padding: var(--space-12); color: var(--color-text-muted); }
.addresses-page__empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-3); padding: var(--space-12) var(--space-4); color: var(--color-text-muted); }
.addresses-page__empty svg { color: var(--color-accent); }
.addresses-page__empty h2 { color: var(--color-text); }
.addresses-page__list { display: flex; flex-direction: column; gap: var(--space-3); }
</style>
