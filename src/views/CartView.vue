<template>
  <div class="cart-view">
    <AppHeader />
    <main class="cart-view__main">
      <div class="cart-view__header">
        <h1 class="cart-view__title">Meu Carrinho 🛒</h1>
      </div>

      <!-- Empty state -->
      <div v-if="cart.isEmpty" class="cart-empty">
        <span class="cart-empty__emoji">🍪</span>
        <p class="cart-empty__text">Seu carrinho está vazio</p>
        <RouterLink to="/" class="back-btn">Ver produtos</RouterLink>
      </div>

      <!-- Items list -->
      <template v-else>
        <ul class="cart-items">
          <li v-for="item in cart.items" :key="item.id" class="cart-item">
            <span class="cart-item__emoji">{{ item.emoji }}</span>
            <div class="cart-item__info">
              <span class="cart-item__name">{{ item.name }}</span>
              <span class="cart-item__price">R$ {{ fmt(item.price) }}</span>
            </div>
            <div class="cart-item__qty">
              <button @click="cart.decrementItem(item.id)" aria-label="Diminuir">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="cart.addItem(item)" aria-label="Aumentar">+</button>
            </div>
          </li>
        </ul>

        <div class="cart-summary">
          <div class="cart-summary__row">
            <span>Total</span>
            <strong>R$ {{ fmt(cart.total) }}</strong>
          </div>
          <button class="checkout-btn">
            Finalizar pedido →
          </button>
          <p class="cart-summary__note">Integração com checkout Django em breve</p>
        </div>
      </template>
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
const fmt = (v) => v.toFixed(2).replace('.', ',')
</script>

<style scoped>
.cart-view { min-height: 100dvh; display: flex; flex-direction: column; background: var(--c-cream); }
.cart-view__main { flex: 1; padding: var(--sp-6) var(--page-padding) calc(var(--bottom-nav-h) + var(--sp-6)); }
.cart-view__title { font-family: var(--font-display); font-size: 1.5rem; color: var(--c-espresso); margin-bottom: var(--sp-6); }

/* Empty */
.cart-empty { display: flex; flex-direction: column; align-items: center; gap: var(--sp-4); padding: var(--sp-12) 0; text-align: center; }
.cart-empty__emoji { font-size: 3rem; }
.cart-empty__text { color: var(--c-muted); font-size: 0.95rem; }

/* Items */
.cart-items { list-style: none; display: flex; flex-direction: column; gap: var(--sp-3); }
.cart-item { background: var(--c-surface); border-radius: var(--r-md); padding: var(--sp-4); display: flex; align-items: center; gap: var(--sp-3); box-shadow: var(--shadow-card); }
.cart-item__emoji { font-size: 2rem; flex-shrink: 0; }
.cart-item__info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.cart-item__name { font-weight: 600; font-size: 0.85rem; color: var(--c-espresso); }
.cart-item__price { font-size: 0.8rem; color: var(--c-caramel); font-weight: 700; }
.cart-item__qty { display: flex; align-items: center; gap: var(--sp-3); }
.cart-item__qty button { width: 28px; height: 28px; border-radius: 50%; background: var(--c-cream-dark); border: none; cursor: pointer; font-size: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: background var(--t-fast); }
.cart-item__qty button:hover { background: var(--c-caramel); color: #fff; }
.cart-item__qty span { font-weight: 700; min-width: 20px; text-align: center; }

/* Summary */
.cart-summary { margin-top: var(--sp-6); background: var(--c-surface); border-radius: var(--r-lg); padding: var(--sp-6); box-shadow: var(--shadow-card); display: flex; flex-direction: column; gap: var(--sp-4); }
.cart-summary__row { display: flex; justify-content: space-between; align-items: center; font-size: 1rem; }
.cart-summary__row strong { font-size: 1.2rem; color: var(--c-caramel); font-weight: 700; }
.checkout-btn { padding: var(--sp-4); background: var(--c-espresso); color: var(--c-cream); border: none; border-radius: var(--r-full); font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: background var(--t-fast); }
.checkout-btn:hover { background: var(--c-caramel); }
.cart-summary__note { font-size: 0.7rem; color: var(--c-muted); text-align: center; }

.back-btn { display: inline-block; padding: var(--sp-3) var(--sp-6); background: var(--c-espresso); color: var(--c-cream); border-radius: var(--r-full); font-weight: 600; font-size: 0.85rem; text-decoration: none; }
</style>
