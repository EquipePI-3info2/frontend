<template>
  <nav class="bottom-nav" aria-label="Navegação principal">
    <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="bottom-nav__item" :aria-label="item.label">
      <div class="bottom-nav__icon-wrap">
        <component :is="item.icon" :size="24" />
        <span v-if="item.badge > 0" class="bottom-nav__badge" :aria-label="`${item.badge} itens no carrinho`">{{ item.badge > 9 ? '9+' : item.badge }}</span>
      </div>
      <span class="bottom-nav__label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Home, LayoutDashboard, Search, ShoppingCart, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCartStore } from '@/stores/useCartStore'

const authStore = useAuthStore()
const cartStore = useCartStore()

const navItems = computed(() => {
  const items = [
    { to: '/', label: 'Início', icon: Home, badge: 0 },
    { to: '/busca', label: 'Buscar', icon: Search, badge: 0 },
    { to: '/carrinho', label: 'Carrinho', icon: ShoppingCart, badge: cartStore.totalItems },
    { to: '/perfil', label: 'Perfil', icon: User, badge: 0 },
  ]

  if (authStore.isAdmin) {
    items.push({ to: '/admin', label: 'Painel', icon: LayoutDashboard, badge: 0 })
  }

  return items
})
</script>
<style scoped>
.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 200; background: var(--color-primary); display: flex; justify-content: space-around; align-items: center; min-height: var(--nav-height); padding-bottom: env(safe-area-inset-bottom,0); max-width: 480px; margin-inline: auto; }
.bottom-nav__item { display: flex; flex-direction: column; gap: 2px; align-items: center; justify-content: center; flex: 1; min-width: 0; min-height: var(--nav-height); color: rgba(255,255,255,.6); transition: color var(--transition); position: relative; }
.bottom-nav__item.router-link-active, .bottom-nav__item.router-link-exact-active { color: #fff; }
.bottom-nav__icon-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
.bottom-nav__label { font-size: .58rem; font-weight: 700; white-space: nowrap; }
.bottom-nav__badge { position: absolute; top: -6px; right: -8px; background: var(--color-accent); color: var(--color-primary); font-size: .65rem; font-weight: 800; min-width: 18px; height: 18px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; padding: 0 3px; line-height: 1; }
</style>
