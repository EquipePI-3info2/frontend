<template>
  <header class="page-header">
    <button class="page-header__back" type="button" aria-label="Voltar" @click="goBack">
      <ArrowLeft :size="22" />
    </button>
    <div class="page-header__titles">
      <p v-if="eyebrow" class="page-header__eyebrow">{{ eyebrow }}</p>
      <h1 class="page-header__title">{{ title }}</h1>
    </div>
    <div class="page-header__action"><slot /></div>
  </header>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, required: true },
  eyebrow: { type: String, default: '' },
  fallback: { type: [String, Object], default: '/' },
})

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push(props.fallback)
}
</script>

<style scoped>
.page-header {
  min-height: 76px;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  position: sticky;
  top: 0;
  z-index: 90;
}
.page-header__back,
.page-header__action {
  width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-header__back {
  border-radius: var(--radius-md);
}
.page-header__back:active { background: rgba(59, 26, 8, .08); }
.page-header__titles { text-align: center; min-width: 0; }
.page-header__eyebrow {
  color: var(--color-text-muted);
  font-size: .7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.page-header__title {
  color: var(--color-primary);
  font-size: 1.15rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
