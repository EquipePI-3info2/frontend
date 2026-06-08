<template>
  <main class="login">
    <div class="login__container">
      <img
        :src="logoUrl"
        alt="Brookiê"
        class="login__logo"
      />

      <h1 class="login__title">
        Entrar
      </h1>

      <!-- Mensagem de erro vinda do store -->
      <p v-if="authStore.error" class="login__error">
        {{ authStore.error }}
      </p>

      <form class="login__form" @submit.prevent="handleSubmit">
        <div class="login__field">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="login__input"
            autocomplete="email"
            required
          />
        </div>

        <div class="login__field">
          <input
            v-model="password"
            type="password"
            placeholder="Senha"
            class="login__input"
            autocomplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          class="login__button"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

      <RouterLink
        to="/cadastro"
        class="login__register"
      >
        Cadastre-se
      </RouterLink>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import logoUrl from '@/assets/images/logo.png'

const authStore = useAuthStore()
const router    = useRouter()

const email    = ref('')
const password = ref('')

async function handleSubmit() {
  try {
    await authStore.login(email.value, password.value)
    // Login bem-sucedido → redireciona para o perfil (ou home)
    router.push({ name: 'profile' })
  } catch {
    // O erro já está em authStore.error — nada a fazer aqui
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: #FDE8E0;
  display: flex;
  justify-content: center;
}

.login__container {
  width: 100%;
  max-width: 420px;

  padding-left: 32px;
  padding-right: 32px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.login__logo {
  width: 180px;
  margin-top: 90px;
  margin-bottom: 70px;
}

.login__title {
  font-size: 2rem;
  font-weight: 800;
  color: #3B1A08;

  align-self: flex-start;

  margin-bottom: 32px;
}

.login__error {
  width: 100%;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.login__form {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 18px;
}

.login__input {
  width: 100%;
  height: 56px;

  border: none;
  outline: none;

  background: white;

  border-radius: 999px;

  padding: 0 24px;

  font-size: 1rem;

  color: #3B1A08;

  box-shadow: 0 4px 12px rgba(0,0,0,.08);
}

.login__input::placeholder {
  color: #9C7D6E;
}

.login__button {
  width: 100%;
  height: 56px;

  margin-top: 8px;

  border: none;

  border-radius: 999px;

  background: #3B1A08;

  color: white;

  font-size: 1rem;
  font-weight: 800;

  cursor: pointer;

  transition: .2s;
}

.login__button:hover:not(:disabled) {
  background: #512613;
}

.login__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login__register {
  margin-top: 24px;

  color: #3B1A08;

  font-size: 0.95rem;
  font-weight: 700;
}
</style>
