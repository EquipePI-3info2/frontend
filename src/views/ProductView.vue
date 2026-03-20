<template>
  <div class="stub-view">
    <AppHeader />
    <main class="stub-view__main">
      <div class="stub-view__content">
        <span class="stub-emoji">🍪</span>
        <h1>Produto</h1>
        <p>Slug: <code>{{ $route.params.slug }}</code></p>
        <p>Em breve – <code>GET /api/v1/products/:slug/</code></p>
        <RouterLink to="/" class="back-btn">← Voltar à home</RouterLink>
      </div>
    </main>
    <BottomNav />
  </div>
</template>
<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
</script>
<style scoped>
.stub-view { min-height: 100dvh; display: flex; flex-direction: column; background: var(--c-cream); }
.stub-view__main { flex: 1; display: flex; align-items: center; justify-content: center; padding-bottom: var(--bottom-nav-h); }
.stub-view__content { text-align: center; padding: var(--sp-8); display: flex; flex-direction: column; align-items: center; gap: var(--sp-4); }
.stub-emoji { font-size: 3rem; }
h1 { font-family: var(--font-display); font-size: 1.8rem; color: var(--c-espresso); }
p { color: var(--c-muted); font-size: 0.9rem; }
code { background: var(--c-cream-dark); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; }
.back-btn { display: inline-block; margin-top: var(--sp-2); padding: var(--sp-3) var(--sp-6); background: var(--c-espresso); color: var(--c-cream); border-radius: var(--r-full); font-weight: 600; font-size: 0.85rem; text-decoration: none; }
</style>
