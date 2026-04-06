<template>
  <nav class="bottom-nav" aria-label="Navegação principal">
    <RouterLink
      v-for="item in navItems"
      :key="item.name"
      :to="item.to"
      class="bottom-nav__item"
      :aria-label="item.label"
    >
      <span class="bottom-nav__icon-wrap">
        <component :is="item.icon" :size="22" stroke-width="1.75" />
        <span
          v-if="item.name === 'carrinho' && cartCount > 0"
          class="bottom-nav__badge"
        >
          {{ cartCount > 9 ? '9+' : cartCount }}
        </span>
      </span>
      <span class="bottom-nav__label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { HomeIcon, SearchIcon, ShoppingCartIcon, UserIcon } from 'lucide-vue-next'
import { useCartStore } from '@/stores/useCartStore.js'

const cartStore = useCartStore()
const cartCount = computed(() => cartStore.totalItems)

const navItems = [
  { name: 'home',     to: '/',        icon: HomeIcon,         label: 'Home'     },
  { name: 'busca',    to: '/busca',    icon: SearchIcon,       label: 'Busca'    },
  { name: 'carrinho', to: '/carrinho', icon: ShoppingCartIcon, label: 'Carrinho' },
  { name: 'perfil',   to: '/perfil',   icon: UserIcon,         label: 'Perfil'   },
]
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);       /* 68px */
  background-color: var(--color-primary); /* #3B1A08 */
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom, 0);
  z-index: 200;
}

/* Item individual */
.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  height: 100%;
  color: rgba(255, 255, 255, 0.50);
  text-decoration: none;
  position: relative;
  transition: color var(--transition-fast);
}

.bottom-nav__item:hover { color: rgba(255, 255, 255, 0.80); }

/* Ativo: branco sólido */
.bottom-nav__item.router-link-exact-active,
.bottom-nav__item.router-link-active {
  color: #FFFFFF;
}

/* Ícone */
.bottom-nav__icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

/* Badge carrinho */
.bottom-nav__badge {
  position: absolute;
  top: -5px;
  right: -7px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  background-color: var(--color-accent);
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 800;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  animation: fadeIn 0.2s ease;
}

/* Label texto abaixo do ícone */
.bottom-nav__label {
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.01em;
}
</style>
