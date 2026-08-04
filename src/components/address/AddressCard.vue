<template>
  <article class="address-card" :class="{ 'address-card--selected': selected }">
    <button v-if="selectable" type="button" class="address-card__select" @click="$emit('select', address.id)">
      <span class="address-card__radio" :class="{ 'address-card__radio--active': selected }" />
      <span class="sr-only">Selecionar endereço</span>
    </button>

    <div class="address-card__content" @click="selectable && $emit('select', address.id)">
      <div class="address-card__title-row">
        <h2>{{ address.label || 'Endereço' }}</h2>
        <span v-if="address.is_default" class="address-card__badge">Padrão</span>
      </div>
      <p>{{ address.street }}, {{ address.number }}<template v-if="address.complement"> — {{ address.complement }}</template></p>
      <p>{{ address.neighborhood }} · {{ address.city }}/{{ address.state }}</p>
      <p>CEP {{ address.zip_code }}</p>
    </div>

    <div v-if="editable" class="address-card__actions">
      <button type="button" aria-label="Editar endereço" @click="$emit('edit', address)"><Pencil :size="17" /></button>
      <button type="button" aria-label="Excluir endereço" class="address-card__delete" @click="$emit('delete', address)"><Trash2 :size="17" /></button>
    </div>
  </article>
</template>

<script setup>
import { Pencil, Trash2 } from 'lucide-vue-next'

defineProps({
  address: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  selectable: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
})
defineEmits(['select', 'edit', 'delete'])
</script>

<style scoped>
.address-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-3);
  background: var(--color-surface);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}
.address-card:has(.address-card__select) { grid-template-columns: 28px 1fr auto; }
.address-card--selected { border-color: var(--color-accent); background: #fff8f4; }
.address-card__select { width: 28px; display: flex; align-items: flex-start; justify-content: center; padding-top: 3px; }
.address-card__radio { width: 19px; height: 19px; border: 2px solid #b79b8d; border-radius: 50%; display: block; }
.address-card__radio--active { border: 5px solid var(--color-primary); }
.address-card__content { min-width: 0; cursor: default; }
.address-card__select + .address-card__content { cursor: pointer; }
.address-card__title-row { display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-1); }
.address-card h2 { font-size: 1rem; }
.address-card p { color: var(--color-text-muted); font-size: .82rem; line-height: 1.45; }
.address-card__badge { font-size: .65rem; font-weight: 800; background: var(--color-primary); color: white; padding: 2px 8px; border-radius: var(--radius-full); }
.address-card__actions { display: flex; gap: var(--space-1); align-items: flex-start; }
.address-card__actions button { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); }
.address-card__actions button:active { background: #f8eee9; }
.address-card__delete { color: #a33c3c; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
</style>
