<template>
  <div class="profile">
    <div class="profile__container">

      <!-- Loading enquanto o perfil está sendo buscado -->
      <div v-if="authStore.loading" class="profile__loading">
        Carregando…
      </div>

      <template v-else-if="authStore.user">
        <div class="profile__avatar">
          <img v-if="authStore.user?.profile_photo_url" :src="authStore.user.profile_photo_url" alt="Foto de perfil"
            class="profile__avatar-image">

          <span v-else>
            {{ initials }}
          </span>
        </div>

        <h1 class="profile__name">{{ authStore.user.name }}</h1>
        <p class="profile__email">{{ authStore.user.email }}</p>

        <div v-if="authStore.isAdmin" class="profile__badge">
          Administrador
        </div>

        <div class="profile__info">
          <div class="profile__info-item">
            <span class="profile__info-label">Membro desde</span>
            <span class="profile__info-value">{{ memberSince }}</span>
          </div>
        </div>
        <div>
          <button @click="router.push({ name: 'EditProfile' })">Editar perfil</button>
        </div>

        <button class="profile__logout" @click="handleLogout">
          Sair da conta
        </button>
      </template>

      <!-- Fallback (não deveria aparecer — rota é protegida) -->
      <div v-else class="profile__fallback">
        <p>Sessão não encontrada.</p>
        <RouterLink to="/login" class="profile__link">Fazer login</RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()

// Iniciais do nome para o avatar
const initials = computed(() => {
  const name = authStore.user?.name || ''
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
})

// Data de cadastro formatada (campo created_at do backend)
const memberSince = computed(() => {
  const raw = authStore.user?.created_at
  if (!raw) return '—'
  return new Date(raw).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
})

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background: #FDE8E0;
  display: flex;
  justify-content: center;
  padding-bottom: 48px;
}

.profile__container {
  width: 100%;
  max-width: 420px;
  padding: 48px 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile__loading {
  margin-top: 80px;
  color: #9C7D6E;
  font-size: 1rem;
}

.profile__avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #3B1A08;
  color: white;
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.profile__avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.profile__name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #3B1A08;
  margin-bottom: 4px;
  text-align: center;
}

.profile__email {
  font-size: 0.95rem;
  color: #9C7D6E;
  margin-bottom: 12px;
}

.profile__badge {
  background: #3B1A08;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 4px 14px;
  margin-bottom: 24px;
}

.profile__info {
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .06);
  margin-bottom: 32px;
}

.profile__info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile__info-label {
  font-size: 0.875rem;
  color: #9C7D6E;
}

.profile__info-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #3B1A08;
}

.profile__logout {
  width: 100%;
  height: 52px;
  border: 2px solid #3B1A08;
  border-radius: 999px;
  background: transparent;
  color: #3B1A08;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: .2s;
}

.profile__logout:hover {
  background: #3B1A08;
  color: white;
}

.profile__fallback {
  margin-top: 80px;
  text-align: center;
  color: #9C7D6E;
}

.profile__link {
  display: inline-block;
  margin-top: 12px;
  color: #3B1A08;
  font-weight: 700;
}
</style>
