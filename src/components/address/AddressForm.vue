<template>
  <form class="address-form" @submit.prevent="submit">
    <div class="address-form__heading">
      <div>
        <p>{{ address?.id ? 'Atualize os dados' : 'Novo endereço' }}</p>
        <h2>{{ address?.id ? 'Editar endereço' : 'Cadastrar endereço' }}</h2>
      </div>
      <button v-if="showCancel" type="button" aria-label="Fechar formulário" @click="$emit('cancel')"><X :size="21" /></button>
    </div>

    <FeedbackMessage :message="localError" />

    <label class="field">
      <span>Identificação</span>
      <input v-model.trim="form.label" maxlength="50" placeholder="Ex.: Casa ou Trabalho" />
    </label>

    <div class="address-form__grid address-form__grid--street">
      <label class="field">
        <span>Rua</span>
        <input v-model.trim="form.street" required maxlength="200" autocomplete="address-line1" />
      </label>
      <label class="field">
        <span>Número</span>
        <input v-model.trim="form.number" required maxlength="20" />
      </label>
    </div>

    <label class="field">
      <span>Complemento</span>
      <input v-model.trim="form.complement" maxlength="100" placeholder="Opcional" autocomplete="address-line2" />
    </label>

    <label class="field">
      <span>Bairro</span>
      <input v-model.trim="form.neighborhood" required maxlength="100" />
    </label>

    <div class="address-form__grid address-form__grid--city">
      <label class="field">
        <span>Cidade</span>
        <input v-model.trim="form.city" required maxlength="100" autocomplete="address-level2" />
      </label>
      <label class="field">
        <span>UF</span>
        <input v-model="form.state" required maxlength="2" autocomplete="address-level1" @input="normalizeState" />
      </label>
    </div>

    <label class="field">
      <span>CEP</span>
      <input v-model="form.zip_code" required maxlength="9" inputmode="numeric" autocomplete="postal-code" @input="maskZip" />
    </label>

    <label class="address-form__check">
      <input v-model="form.is_default" type="checkbox" />
      <span>Usar como endereço padrão</span>
    </label>

    <div class="address-form__buttons">
      <AppButton type="submit" :loading="loading">{{ address?.id ? 'Salvar alterações' : 'Cadastrar endereço' }}</AppButton>
      <AppButton v-if="showCancel" type="button" variant="ghost" :disabled="loading" @click="$emit('cancel')">Cancelar</AppButton>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import AppButton from '@/components/common/AppButton.vue'
import FeedbackMessage from '@/components/common/FeedbackMessage.vue'
import { formatZipCode } from '@/utils/formatters'

const props = defineProps({
  address: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  showCancel: { type: Boolean, default: true },
})
const emit = defineEmits(['submit', 'cancel'])
const localError = ref('')

const emptyForm = () => ({
  label: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip_code: '', is_default: false,
})
const form = reactive(emptyForm())

watch(
  () => props.address,
  (value) => Object.assign(form, emptyForm(), value || {}),
  { immediate: true },
)

function normalizeState(event) {
  form.state = event.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
}
function maskZip(event) {
  form.zip_code = formatZipCode(event.target.value)
}
function submit() {
  localError.value = ''
  if (!form.street || !form.number || !form.neighborhood || !form.city || form.state.length !== 2) {
    localError.value = 'Preencha todos os campos obrigatórios.'
    return
  }
  if (form.zip_code.replace(/\D/g, '').length !== 8) {
    localError.value = 'Informe um CEP válido com oito dígitos.'
    return
  }
  emit('submit', {
    label: form.label,
    street: form.street,
    number: form.number,
    complement: form.complement,
    neighborhood: form.neighborhood,
    city: form.city,
    state: form.state,
    zip_code: form.zip_code,
    is_default: form.is_default,
  })
}
</script>

<style scoped>
.address-form { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-5); box-shadow: var(--shadow-md); display: flex; flex-direction: column; gap: var(--space-4); }
.address-form__heading { display: flex; justify-content: space-between; align-items: flex-start; }
.address-form__heading p { color: var(--color-text-muted); font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; }
.address-form__heading h2 { font-size: 1.2rem; }
.address-form__heading button { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
.field { display: flex; flex-direction: column; gap: 5px; font-size: .8rem; font-weight: 800; }
.field input { width: 100%; min-height: 46px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); padding: 0 var(--space-3); background: #fffdfa; outline: none; font-weight: 600; }
.field input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px rgba(244,169,138,.18); }
.address-form__grid { display: grid; gap: var(--space-3); }
.address-form__grid--street { grid-template-columns: minmax(0, 1fr) 92px; }
.address-form__grid--city { grid-template-columns: minmax(0, 1fr) 76px; }
.address-form__check { display: flex; gap: var(--space-2); align-items: center; font-size: .85rem; font-weight: 700; }
.address-form__check input { width: 18px; height: 18px; accent-color: var(--color-primary); }
.address-form__buttons { display: flex; flex-direction: column; gap: var(--space-2); }
.address-form__buttons :deep(button) { width: 100%; }
</style>
