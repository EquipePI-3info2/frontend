<template>
  <main class="not-found container">
    <div class="not-found__code">404</div>
    <h1>Essa página não foi encontrada</h1>
    <p>O endereço pode ter mudado ou não existir mais.</p>
    <AppButton @click="router.push('/')"><Home :size="18" /> Voltar para a loja</AppButton>
  </main>
</template>
<script setup>
import { Home } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
const router = useRouter()
</script>
<style scoped>
.not-found { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: var(--space-3); }
.not-found__code { font-size: 5rem; font-weight: 900; color: var(--color-accent); line-height: 1; }
.not-found h1 { font-size: 1.4rem; }
.not-found p { color: var(--color-text-muted); margin-bottom: var(--space-3); }
</style>
