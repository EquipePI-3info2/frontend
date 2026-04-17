<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink to="/" class="app-header__logo-link" aria-label="Ir para a página inicial">
        <img
          :src="logoUrl"
          alt="Brookiê — Cookies e Brownies Artesanais"
          class="app-header__logo"
          width="110"
          height="40"
        />
      </RouterLink>

      <button
        class="app-header__menu-btn"
        aria-label="Abrir menu"
        @click="$emit('toggle-menu')"
      >
        <Menu :size="26" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { Menu } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import logoUrl from '@/assets/images/logo.png'

defineEmits(['toggle-menu'])
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg);
}
.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-3);
}
.app-header__logo {
  height: 36px;
  width: auto;
  object-fit: contain;
}
.app-header__menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  color: var(--color-primary);
  transition: background var(--transition);
}
.app-header__menu-btn:active { background: rgba(59, 26, 8, 0.08); }
</style>
