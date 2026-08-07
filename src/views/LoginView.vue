<template>
  <main class="page">
    <div class="page__top"><img :src="logoUrl" alt="Brookiê" class="page__logo" /></div>
    <section class="page__card">
      <h1 class="card__title">Login</h1>
      <p v-if="route.query.registered" class="card__success">Conta criada com sucesso. Agora faça seu login.</p>
      <p v-if="authStore.error" class="card__error">{{ authStore.error }}</p>
      <form class="card__form" @submit.prevent="handleSubmit">
        <label class="card__field"><span class="field__label">E-mail</span><input v-model.trim="email" type="email" class="field__input" autocomplete="email" required /></label>
        <label class="card__field"><span class="field__label">Senha</span><input v-model="password" type="password" class="field__input" autocomplete="current-password" required /></label>
        <button type="submit" class="card__btn" :disabled="authStore.loading">{{ authStore.loading ? 'Entrando…' : 'Entrar' }}</button>
      </form>
      <RouterLink :to="{ name: 'register', query: route.query.redirect ? { redirect: route.query.redirect } : {} }" class="card__link">Não tem uma conta? <strong>Cadastre-se!</strong></RouterLink>
      <RouterLink to="/" class="card__home">Voltar para a loja</RouterLink>
    </section>
  </main>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import logoUrl from '@/assets/images/logo.png'
const authStore = useAuthStore(); const route = useRoute(); const router = useRouter(); const email = ref(''); const password = ref('')
onMounted(() => authStore.clearError())
async function handleSubmit() {
  try {
    await authStore.login(email.value, password.value)
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : '/perfil'
    router.replace(redirect)
  } catch { /* store exibe erro */ }
}
</script>
<style scoped>
.page { min-height: 100vh; display: flex; flex-direction: column; background: var(--color-bg); }
.page__top { display: flex; justify-content: center; padding: 64px 32px 40px; }
.page__logo { width: 172px; }
.page__card { flex: 1; background: #390f09; border-radius: 36px 36px 0 0; padding: 44px 28px 40px; display: flex; flex-direction: column; align-items: center; }
.card__title { font-size: 2.4rem; color: var(--color-bg); margin-bottom: 30px; }
.card__error, .card__success { width: 100%; border-radius: 12px; padding: 12px 16px; font-size: .85rem; font-weight: 700; margin-bottom: 16px; text-align: center; }
.card__error { background: rgba(255,80,80,.15); color: #ffb3b3; }
.card__success { background: rgba(110,196,110,.18); color: #b9f0c1; }
.card__form { width: 100%; display: flex; flex-direction: column; gap: 14px; }
.card__field { width: 100%; background: #fbf5f0; border-radius: 18px; padding: 13px 22px 15px; }
.field__label { display: block; font-size: .68rem; font-weight: 800; margin-bottom: 3px; }
.field__input { display: block; width: 100%; background: transparent; border: 0; outline: 0; font-size: 1rem; padding: 0; }
.card__btn { width: 100%; height: 56px; margin-top: 8px; border-radius: var(--radius-full); background: #f4a49c; color: #390f09; font-weight: 800; }
.card__btn:disabled { opacity: .6; }
.card__link { margin-top: auto; padding-top: 36px; color: var(--color-bg); font-size: .9rem; }
.card__home { margin-top: 14px; color: rgba(255,255,255,.65); font-size: .8rem; }
</style>
