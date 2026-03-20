<template>
  <div class="app-shell">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <ToastContainer />
  </div>
</template>

<script setup>
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to  { opacity: 0; transform: translateY(-8px); }

.app-shell {
  position: relative;
  min-height: 100dvh;
}
</style>
