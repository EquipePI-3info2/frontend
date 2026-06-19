<template>
  <main class="page">

    <!-- ── Topo: seta voltar + título ── -->
    <div class="page__top">
      <button class="page__back" @click="router.go(-1)" aria-label="Voltar">←</button>
      <h1 class="page__title">Cadastre-se</h1>
    </div>

    <!-- ── Card escuro ── -->
    <section class="page__card">

      <p v-if="localError || authStore.error" class="card__error">
        {{ localError || authStore.error }}
      </p>

      <form class="card__form" @submit.prevent="handleSubmit">

        <div class="card__field">
          <span class="field__label">Nome</span>
          <input
            v-model="name"
            type="text"
            class="field__input"
            autocomplete="name"
            required
          />
        </div>

        <div class="card__field">
          <span class="field__label">Email</span>
          <input
            v-model="email"
            type="email"
            class="field__input"
            autocomplete="email"
            required
          />
        </div>

        <div class="card__field">
          <span class="field__label">Senha</span>
          <input
            v-model="password"
            type="password"
            class="field__input"
            autocomplete="new-password"
            required
          />
        </div>

        <div class="card__field">
          <span class="field__label">Confirme a senha</span>
          <input
            v-model="passwordConfirm"
            type="password"
            class="field__input"
            autocomplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          class="card__btn"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Criando conta…' : 'Cadastre-se' }}
        </button>

      </form>

      <RouterLink to="/" class="card__link">
        Já tem uma conta? <strong>Entre!</strong>
      </RouterLink>

    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore       = useAuthStore()
const router          = useRouter()

const name            = ref('')
const email           = ref('')
const password        = ref('')
const passwordConfirm = ref('')
const localError      = ref('')

async function handleSubmit() {
  localError.value = ''

  if (password.value !== passwordConfirm.value) {
    localError.value = 'As senhas não coincidem.'
    return
  }

  try {
    await authStore.register(name.value, email.value, password.value)
    // Cadastro bem-sucedido → redireciona para o login
    router.push('/')
  } catch {
    // O erro já está em authStore.error — nada a fazer aqui
  }
}
</script>

<style scoped>
/* ─── Página ───────────────────────────────────────── */
.page {
  min-height: 100vh;
  background: #FDE8E0;
  display: flex;
  flex-direction: column;
}

/* ─── Topo (seta + título) ─────────────────────────── */
.page__top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 28px 28px;
}

.page__back {
  position: absolute;
  left: 28px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #3B1A08;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  display: flex;
  align-items: center;
}

.page__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3B1A08;
}

/* ─── Card escuro ──────────────────────────────────── */
.page__card {
  flex: 1;
  background: #3B1A08;
  border-top-left-radius: 36px;
  border-top-right-radius: 36px;
  padding: 44px 28px 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ─── Erros (store + validação local) ─────────────── */
.card__error {
  width: 100%;
  background: rgba(255, 80, 80, 0.15);
  color: #FFB3B3;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

/* ─── Formulário ───────────────────────────────────── */
.card__form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ─── Campo com label empilhada ────────────────────── */
.card__field {
  width: 100%;
  background: #FBF5F0;
  border-radius: 18px;
  padding: 13px 22px 15px;
  cursor: text;
}

.field__label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  color: #3B1A08;
  margin-bottom: 3px;
  letter-spacing: 0.01em;
}

.field__input {
  display: block;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #3B1A08;
  padding: 0;
}

/* ─── Botão ────────────────────────────────────────── */
.card__btn {
  width: 100%;
  height: 56px;
  margin-top: 8px;
  border: none;
  border-radius: 999px;
  background: #F4A49C;
  color: #3B1A08;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.card__btn:hover:not(:disabled) {
  background: #f09690;
}

.card__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ─── Link para login ──────────────────────────────── */
.card__link {
  margin-top: auto;
  padding-top: 36px;
  color: #FDE8E0;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
}

.card__link strong {
  font-weight: 700;
}
</style>
