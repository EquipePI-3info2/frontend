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

      <form class="login__form">
        <div class="login__field">
          <input
            type="email"
            placeholder="Email"
            class="login__input"
          />
        </div>

        <div class="login__field">
          <input
            type="password"
            placeholder="Senha"
            class="login__input"
          />
        </div>

        <button
          type="submit"
          class="login__button"
        >
          Entrar
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
import { RouterLink } from 'vue-router'
import logoUrl from '@/assets/images/logo.png'
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

.login__button:hover {
  background: #512613;
}

.login__register {
  margin-top: 24px;

  color: #3B1A08;

  font-size: 0.95rem;
  font-weight: 700;
}
</style>
