<template>
  <button
    :class="['app-btn', `app-btn--${variant}`, `app-btn--${size}`, { 'app-btn--loading': loading }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="app-btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant:  { type: String, default: 'primary' },  // primary | accent | ghost | outline
  size:     { type: String, default: 'md' },        // sm | md | lg
  loading:  { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-base);
  font-weight: 700;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: background var(--transition), opacity var(--transition), transform var(--transition);
  user-select: none;
  white-space: nowrap;
}
.app-btn:active:not(:disabled) { transform: scale(0.97); }
.app-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Tamanhos */
.app-btn--sm { padding: 0.4rem 1rem;  font-size: 0.8rem;  min-height: 36px; }
.app-btn--md { padding: 0.6rem 1.4rem; font-size: 0.9rem; min-height: 44px; }
.app-btn--lg { padding: 0.8rem 2rem;  font-size: 1rem;   min-height: 52px; }

/* Variantes */
.app-btn--primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}
.app-btn--primary:hover:not(:disabled) { background: var(--color-primary-light); }

.app-btn--accent {
  background: var(--color-accent);
  color: var(--color-primary);
}
.app-btn--accent:hover:not(:disabled) { filter: brightness(0.95); }

.app-btn--ghost {
  background: transparent;
  color: var(--color-primary);
}
.app-btn--ghost:hover:not(:disabled) { background: rgba(59, 26, 8, 0.06); }

.app-btn--outline {
  background: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
}
.app-btn--outline:hover:not(:disabled) { background: rgba(59, 26, 8, 0.06); }

/* Spinner */
.app-btn__spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
