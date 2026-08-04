<template>
  <div v-if="message" :class="['feedback-message', `feedback-message--${type}`]" role="alert">
    <component :is="icon" :size="19" aria-hidden="true" />
    <span>{{ message }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { AlertCircle, CheckCircle2, Info } from 'lucide-vue-next'

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'error' },
})

const icon = computed(() => {
  if (props.type === 'success') return CheckCircle2
  if (props.type === 'info') return Info
  return AlertCircle
})
</script>

<style scoped>
.feedback-message {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: .875rem;
  font-weight: 700;
  line-height: 1.4;
}
.feedback-message--error { color: #8a1f1f; background: #fde7e7; }
.feedback-message--success { color: #216b39; background: #e5f6ea; }
.feedback-message--info { color: #4c3c33; background: #fff4e6; }
.feedback-message svg { flex: none; margin-top: 1px; }
</style>
