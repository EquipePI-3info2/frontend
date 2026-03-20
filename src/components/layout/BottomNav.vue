<template>
  <nav class="bottom-nav" aria-label="Navegação principal">
    <RouterLink
      v-for="item in navItems"
      :key="item.name"
      :to="item.to"
      class="nav-item"
      :class="{ 'nav-item--active': isActive(item) }"
      :aria-label="item.label"
    >
      <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
      <span class="nav-badge" v-if="item.badge && cartCount > 0">
        {{ cartCount > 9 ? '9+' : cartCount }}
      </span>
      <span class="nav-label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const route = useRoute()
const cart = useCartStore()
const { count: cartCount } = storeToRefs(cart)

const navItems = [
  { name: 'home',    label: 'Início',    icon: '🏠', to: '/',          badge: false },
  { name: 'search',  label: 'Buscar',    icon: '🔍', to: '/buscar',    badge: false },
  { name: 'cart',    label: 'Carrinho',  icon: '🛒', to: '/carrinho',  badge: true  },
  { name: 'catalog', label: 'Catálogo',  icon: '📋', to: '/catalogo',  badge: false },
  { name: 'profile', label: 'Perfil',    icon: '👤', to: '/perfil',    badge: false }
]

const isActive = (item) => route.path === item.to
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--max-content);
  height: var(--bottom-nav-h);
  background: rgba(255, 251, 245, 0.95);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(61, 26, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 var(--sp-2);
  padding-bottom: env(safe-area-inset-bottom, 0);
  z-index: 100;
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
  padding: var(--sp-2) 0;
  text-decoration: none;
  color: var(--c-muted);
  transition: color var(--t-fast), transform var(--t-fast);
  -webkit-tap-highlight-color: transparent;
}

.nav-item:active { transform: scale(0.92); }

.nav-item--active {
  color: var(--c-caramel);
}

.nav-icon {
  font-size: 1.35rem;
  line-height: 1;
  transition: transform var(--t-slow);
}

.nav-item--active .nav-icon {
  transform: translateY(-2px) scale(1.15);
}

.nav-label {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1;
}

/* Active indicator */
.nav-item--active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: var(--c-caramel);
  border-radius: 0 0 var(--r-sm) var(--r-sm);
}

/* Cart badge */
.nav-badge {
  position: absolute;
  top: 2px;
  left: calc(50% + 6px);
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  background: var(--c-caramel);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: var(--r-full);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
