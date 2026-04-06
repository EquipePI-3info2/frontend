<template>
  <header class="app-header">
    <div class="app-header__inner container">
      <RouterLink to="/" class="app-header__logo-link" aria-label="Brookiê — Página inicial">
        <img
          :src="logoUrl"
          alt="Brookiê"
          class="app-header__logo"
          width="120"
          height="42"
        />
      </RouterLink>

      <button
        class="app-header__menu-btn"
        aria-label="Abrir menu"
        @click="$emit('toggle-menu')"
      >
        <!-- Hambúrguer manual com 3 linhas (mais fiel ao Figma) -->
        <span class="hamburger">
          <span /><span /><span />
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import logoUrl from '@/assets/images/logo.png'

defineEmits(['toggle-menu'])
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-bg);
  height: var(--header-height);
}

.app-header__inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header__logo-link {
  display: flex;
  align-items: center;
}

.app-header__logo {
  height: 40px;
  width: auto;
  object-fit: contain;
  display: block;
}

/* Botão hambúrguer */
.app-header__menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.app-header__menu-btn:hover  { background-color: rgba(59, 26, 8, 0.07); }
.app-header__menu-btn:active { background-color: rgba(59, 26, 8, 0.12); }

/* 3 linhas do hambúrguer (≡) — idêntico ao Figma */
.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 22px;
}

.hamburger span {
  display: block;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: 2px;
  transition: transform var(--transition-fast);
}

/* Linha do meio ligeiramente mais curta (estilo Figma) */
.hamburger span:nth-child(2) {
  width: 75%;
  align-self: flex-end;
}
</style>
