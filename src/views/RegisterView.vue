<template>
  <main class="page">
    <div class="page__top">
      <button
        class="page__back"
        @click="router.back()"
        aria-label="Voltar"
      >
        ←
      </button>

      <h1 class="page__title">Cadastre-se</h1>
    </div>

    <section class="page__card">
      <p
        v-if="localError || authStore.error"
        class="card__error"
      >
        {{ localError || authStore.error }}
      </p>

      <form
        class="card__form"
        @submit.prevent="handleSubmit"
      >
        <label class="card__field">
          <span class="field__label">Nome completo</span>
          <input
            v-model.trim="name"
            type="text"
            class="field__input"
            autocomplete="name"
            required
          />
        </label>

        <label class="card__field">
          <span class="field__label">E-mail</span>
          <input
            v-model.trim="email"
            type="email"
            class="field__input"
            autocomplete="email"
            required
          />
        </label>

        <label class="card__field">
          <span class="field__label">Telefone</span>
          <input
            :value="phone"
            type="tel"
            class="field__input"
            autocomplete="tel"
            inputmode="numeric"
            placeholder="(47) 99999-9999"
            @input="phone = formatPhone($event.target.value)"
          />
        </label>

        <label class="card__field">
          <span class="field__label">Senha</span>
          <input
            v-model="password"
            type="password"
            minlength="8"
            class="field__input"
            autocomplete="new-password"
            required
          />
        </label>

        <label class="card__field">
          <span class="field__label">Confirme a senha</span>
          <input
            v-model="passwordConfirm"
            type="password"
            minlength="8"
            class="field__input"
            autocomplete="new-password"
            required
          />
        </label>

        <p class="card__hint">
          A senha precisa ter pelo menos 8 caracteres.
        </p>

        <button
          type="submit"
          class="card__btn"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Criando conta…' : 'Criar conta' }}
        </button>
      </form>

      <RouterLink
        :to="{
          name: 'login',
          query: route.query.redirect
            ? { redirect: route.query.redirect }
            : {},
        }"
        class="card__link"
      >
        Já tem uma conta? <strong>Entre!</strong>
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { formatPhone } from '@/utils/formatters'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const passwordConfirm = ref('')
const localError = ref('')

onMounted(() => {
  authStore.clearError()
})

async function handleSubmit() {
  localError.value = ''

  if (password.value.length < 8) {
    localError.value = 'A senha precisa ter pelo menos 8 caracteres.'
    return
  }

  if (password.value !== passwordConfirm.value) {
    localError.value = 'As senhas não coincidem.'
    return
  }

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      telefone: phone.value,
      password: password.value,
    })

    router.replace({
      name: 'login',
      query: {
        registered: '1',
        ...(route.query.redirect
          ? { redirect: route.query.redirect }
          : {}),
      },
    })
  } catch {
    /* store exibe erro */
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.page__top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 28px 24px;
}

.page__back {
  position: absolute;
  left: 28px;
  font-size: 1.5rem;
}

.page__title {
  font-size: 1.5rem;
}

.page__card {
  flex: 1;
  background: var(--color-primary);
  border-radius: 36px 36px 0 0;
  padding: 36px 28px 46px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card__error {
  width: 100%;
  background: rgba(255, 80, 80, 0.15);
  color: #ffb3b3;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
}

.card__form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card__field {
  width: 100%;
  background: #fbf5f0;
  border-radius: 18px;
  padding: 12px 20px 14px;
}

.field__label {
  display: block;
  font-size: 0.68rem;
  font-weight: 800;
  margin-bottom: 3px;
}

.field__input {
  display: block;
  width: 100%;
  background: transparent;
  border: 0;
  outline: 0;
  padding: 0;
}

.card__hint {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.72rem;
  padding-inline: 4px;
}

.card__btn {
  width: 100%;
  height: 56px;
  margin-top: 4px;
  border-radius: var(--radius-full);
  background: #f4a49c;
  color: var(--color-primary);
  font-weight: 800;
}

.card__btn:disabled {
  opacity: 0.6;
}

.card__link {
  margin-top: auto;
  padding-top: 30px;
  color: var(--color-bg);
  font-size: 0.9rem;
}
</style>