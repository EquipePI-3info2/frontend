<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

// Recarrega o perfil do usuário ao iniciar a app caso já exista um token salvo.
// Isso garante que, após um F5, o usuário continue autenticado.
onMounted(() => {
  authStore.init()
})
</script>
