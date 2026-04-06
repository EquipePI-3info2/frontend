<!-- Troque "NOME DA PÁGINA" pelo nome correto em cada arquivo -->
<template>
  <div class="stub-view">
    <h1>Busca</h1>
    <p>Página em construção.</p>
    <RouterLink to="/">← Voltar ao início</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.stub-view {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-8);
  text-align: center;
  font-family: var(--font-family);
  color: var(--color-text);
}
.stub-view h1 { font-size: var(--text-xl); font-weight: 800; }
.stub-view a  { color: var(--color-accent); font-weight: 700; text-decoration: underline; }
</style>
