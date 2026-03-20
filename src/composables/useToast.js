/**
 * composables/useToast.js
 * Toast notification leve, sem dependência externa.
 */
import { ref } from 'vue'

const toasts = ref([])
let _id = 0

export function useToast() {
  function show(message, type = 'success', duration = 2200) {
    const id = ++_id
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  function success(msg) { show(msg, 'success') }
  function error(msg)   { show(msg, 'error') }

  return { toasts, success, error }
}
