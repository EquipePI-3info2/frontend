<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
        >
          <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toasts } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: calc(var(--nav-height) + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 2rem);
  max-width: 420px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--r-lg);
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: var(--shadow-float);
  pointer-events: auto;
}

.toast--success {
  background: var(--c-espresso);
  color: var(--c-cream);
}

.toast--error {
  background: var(--c-error);
  color: #fff;
}

.toast-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  flex-shrink: 0;
}

/* Transition */
.toast-enter-active { transition: all 0.3s var(--t-slow); }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from   { opacity: 0; transform: translateY(-12px) scale(0.95); }
.toast-leave-to     { opacity: 0; transform: translateY(-8px) scale(0.95); }
</style>
