<template>
  <component
    :is="tag"
    class="app-btn"
    :class="[`app-btn--${variant}`, `app-btn--${size}`, { 'app-btn--loading': loading }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="app-btn__spinner" aria-hidden="true" />
    <slot />
  </component>
</template>

<script setup>
defineOptions({ inheritAttrs: false })
defineProps({
  variant: {
    type: String, default: 'primary',
    validator: (v) => ['primary', 'accent', 'ghost', 'outline'].includes(v),
  },
  size: {
    type: String, default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  tag:      { type: String,  default: 'button' },
  loading:  { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--radius-full);
  font-family: var(--font-family);
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  border: 2px solid transparent;
  white-space: nowrap;
  text-decoration: none;
  user-select: none;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast),
    opacity var(--transition-fast);
}
.app-btn--sm { font-size: var(--text-xs);  padding: var(--space-2) var(--space-4); min-height: 36px; }
.app-btn--md { font-size: var(--text-sm);  padding: var(--space-3) var(--space-6); min-height: 44px; }
.app-btn--lg { font-size: var(--text-base); padding: var(--space-4) var(--space-8); min-height: 52px; }

.app-btn--primary { background-color: var(--color-primary); color: var(--color-text-inverse); }
.app-btn--primary:hover:not(:disabled) { background-color: var(--color-primary-light); box-shadow: var(--shadow-md); }
.app-btn--primary:active:not(:disabled) { transform: scale(0.97); }

.app-btn--accent { background-color: var(--color-accent); color: var(--color-primary); }
.app-btn--accent:hover:not(:disabled) { background-color: var(--color-accent-hover); box-shadow: var(--shadow-md); }
.app-btn--accent:active:not(:disabled) { transform: scale(0.97); }

.app-btn--ghost { background-color: transparent; color: var(--color-primary); }
.app-btn--ghost:hover:not(:disabled) { background-color: rgba(59, 26, 8, 0.07); }

.app-btn--outline { background-color: transparent; color: var(--color-primary); border-color: var(--color-primary); }
.app-btn--outline:hover:not(:disabled) { background-color: var(--color-primary); color: var(--color-text-inverse); }

.app-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.app-btn--loading { pointer-events: none; }
.app-btn__spinner {
  width: 16px; height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--radius-full);
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }
@media (hover: none) {
  .app-btn:active:not(:disabled) { opacity: 0.8; transform: scale(0.96); }
}
</style>
