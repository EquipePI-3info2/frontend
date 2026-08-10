<template>
  <nav class="admin-nav" aria-label="Navegação administrativa">
    <RouterLink :to="{ name: 'admin-dashboard' }"><LayoutDashboard :size="17" />Painel</RouterLink>
    <RouterLink :to="{ name: 'admin-products' }"><Package :size="17" />Produtos</RouterLink>
    <RouterLink :to="{ name: 'admin-categories' }"><Tags :size="17" />Categorias</RouterLink>
    <RouterLink :to="{ name: 'admin-flavors' }"><Cookie :size="17" />Sabores</RouterLink>
    <RouterLink :to="{ name: 'admin-orders' }"><ClipboardList :size="17" />Pedidos</RouterLink>
    <RouterLink :to="{ name: 'admin-payments' }"><WalletCards :size="17" />Pagamentos</RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ClipboardList, Cookie, LayoutDashboard, Package, Tags, WalletCards } from 'lucide-vue-next'
</script>

<style scoped>
.admin-nav {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding: 4px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  scrollbar-width: none;
}
.admin-nav::-webkit-scrollbar { display: none; }
.admin-nav a {
  flex: 0 0 auto;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: .78rem;
  font-weight: 800;
}
.admin-nav a.router-link-active {
  background: var(--color-primary);
  color: white;
}
</style>
