<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <div class="header__inner">
      <!-- Logo -->
      <RouterLink to="/" class="header__logo" aria-label="Brookie – Página inicial">
        <span class="logo-icon">🍪</span>
        <span class="logo-text">brookie</span>
      </RouterLink>

      <!-- Actions -->
      <div class="header__actions">
        <!-- Cart -->
        <RouterLink to="/carrinho" class="header__btn" aria-label="Carrinho de compras">
          <span class="btn-icon">🛒</span>
          <Transition name="badge">
            <span v-if="cartCount > 0" class="cart-badge" aria-live="polite">
              {{ cartCount > 9 ? '9+' : cartCount }}
            </span>
          </Transition>
        </RouterLink>

        <!-- Hamburger -->
        <button
          class="header__btn header__hamburger"
          :class="{ 'is-open': menuOpen }"
          @click="$emit('toggle-menu')"
          aria-label="Menu de navegação"
          :aria-expanded="menuOpen"
        >
          <span class="bar" />
          <span class="bar" />
          <span class="bar" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

defineProps({
  menuOpen: { type: Boolean, default: false }
})
defineEmits(['toggle-menu'])

const cart = useCartStore()
const { count: cartCount } = storeToRefs(cart)

const isScrolled = ref(false)
const onScroll = () => { isScrolled.value = window.scrollY > 8 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--nav-height);
  background: var(--c-cream);
  transition: box-shadow var(--t-normal), background var(--t-normal);
}

.header--scrolled {
  background: rgba(255, 251, 245, 0.92);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 16px rgba(61, 26, 0, 0.08);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--page-padding);
}

/* Logo */
.header__logo {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  text-decoration: none;
}

.logo-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--c-espresso);
  letter-spacing: -0.03em;
  line-height: 1;
}

/* Actions */
.header__actions {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.header__btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: var(--r-md);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background var(--t-fast);
}

.header__btn:hover { background: var(--c-cream-dark); }
.header__btn:active { transform: scale(0.95); }

.btn-icon { font-size: 1.25rem; line-height: 1; }

/* Cart badge */
.cart-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: var(--c-caramel);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: var(--r-full);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.badge-enter-active { transition: transform 0.3s var(--t-slow), opacity 0.2s ease; }
.badge-enter-from   { transform: scale(0); opacity: 0; }
.badge-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.badge-leave-to     { transform: scale(0); opacity: 0; }

/* Hamburger */
.header__hamburger {
  flex-direction: column;
  gap: 5px;
  padding: 10px;
}

.bar {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--c-espresso);
  border-radius: var(--r-full);
  transition: transform var(--t-normal), opacity var(--t-normal);
  transform-origin: center;
}

.header__hamburger.is-open .bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.header__hamburger.is-open .bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
.header__hamburger.is-open .bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
</style>
