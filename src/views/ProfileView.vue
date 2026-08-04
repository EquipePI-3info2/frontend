<template>
  <div class="profile pb-nav">
    <PageHeader title="Meu perfil" fallback="/" />
    <main class="container profile__container">
      <div v-if="!authStore.user" class="profile__loading">Carregando perfil…</div>
      <template v-else>
        <section class="profile__identity">
          <div class="profile__avatar">
            <img v-if="authStore.user.profile_photo_url" :src="authStore.user.profile_photo_url" alt="Foto de perfil" />
            <span v-else>{{ initials }}</span>
          </div>
          <div><h1>{{ authStore.user.name }}</h1><p>{{ authStore.user.email }}</p><span v-if="authStore.isAdmin" class="profile__badge">Administrador</span></div>
        </section>

        <section class="profile__info-card">
          <div><span>Telefone</span><strong>{{ authStore.user.telefone || 'Não informado' }}</strong></div>
          <div><span>Membro desde</span><strong>{{ memberSince }}</strong></div>
        </section>

        <nav class="profile__menu">
          <RouterLink :to="{ name: 'orders' }"><span class="profile__menu-icon"><Package :size="21" /></span><span><strong>Meus pedidos</strong><small>Acompanhe e consulte suas compras</small></span><ChevronRight :size="19" /></RouterLink>
          <RouterLink :to="{ name: 'addresses' }"><span class="profile__menu-icon"><MapPin :size="21" /></span><span><strong>Meus endereços</strong><small>Cadastre e escolha o endereço padrão</small></span><ChevronRight :size="19" /></RouterLink>
          <RouterLink :to="{ name: 'edit-profile' }"><span class="profile__menu-icon"><UserRoundPen :size="21" /></span><span><strong>Editar perfil</strong><small>Nome, telefone e foto</small></span><ChevronRight :size="19" /></RouterLink>
        </nav>

        <section v-if="authStore.isAdmin" class="profile__admin">
          <p>Administração</p>
          <RouterLink :to="{ name: 'admin-orders' }"><ClipboardList :size="20" />Gerenciar pedidos<ChevronRight :size="18" /></RouterLink>
          <RouterLink :to="{ name: 'admin-payments' }"><WalletCards :size="20" />Gerenciar pagamentos<ChevronRight :size="18" /></RouterLink>
        </section>

        <button class="profile__logout" @click="handleLogout"><LogOut :size="19" /> Sair da conta</button>
      </template>
    </main>
    <BottomNav />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ChevronRight, ClipboardList, LogOut, MapPin, Package, UserRoundPen, WalletCards } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { formatDate } from '@/utils/formatters'
const authStore = useAuthStore(); const router = useRouter()
const initials = computed(() => String(authStore.user?.name || '').split(' ').filter(Boolean).slice(0,2).map((word) => word[0]?.toUpperCase()).join(''))
const memberSince = computed(() => formatDate(authStore.user?.created_at))
function handleLogout() { authStore.logout(); router.replace({ name: 'login' }) }
</script>
<style scoped>
.profile { min-height: 100vh; }
.profile__container { display: flex; flex-direction: column; gap: var(--space-4); padding-bottom: var(--space-8); }
.profile__loading { text-align: center; padding: var(--space-12); color: var(--color-text-muted); }
.profile__identity { display: flex; align-items: center; gap: var(--space-4); background: white; padding: var(--space-5); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); }
.profile__avatar { width: 76px; height: 76px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.55rem; font-weight: 900; overflow: hidden; flex: none; }
.profile__avatar img { width: 100%; height: 100%; object-fit: cover; }
.profile__identity h1 { font-size: 1.2rem; line-height: 1.2; }
.profile__identity p { color: var(--color-text-muted); font-size: .82rem; overflow-wrap: anywhere; }
.profile__badge { display: inline-flex; margin-top: 6px; background: #f3e2d7; border-radius: var(--radius-full); padding: 3px 9px; font-size: .64rem; font-weight: 800; }
.profile__info-card { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); background: white; padding: var(--space-4); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.profile__info-card div { display: flex; flex-direction: column; gap: 2px; }
.profile__info-card span { color: var(--color-text-muted); font-size: .7rem; }
.profile__info-card strong { font-size: .82rem; }
.profile__menu { display: flex; flex-direction: column; overflow: hidden; background: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.profile__menu a { display: grid; grid-template-columns: 42px 1fr 22px; align-items: center; gap: var(--space-3); min-height: 72px; padding: 0 var(--space-4); border-bottom: 1px solid var(--color-border); }
.profile__menu a:last-child { border-bottom: 0; }
.profile__menu-icon { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: #fff3ed; border-radius: var(--radius-md); color: var(--color-primary); }
.profile__menu a > span:nth-child(2) { display: flex; flex-direction: column; }
.profile__menu small { color: var(--color-text-muted); font-size: .7rem; }
.profile__admin { display: flex; flex-direction: column; gap: var(--space-2); background: #fff7ec; padding: var(--space-4); border: 1px solid #ead6ba; border-radius: var(--radius-lg); }
.profile__admin > p { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; font-weight: 900; color: #8b5a2d; }
.profile__admin a { display: grid; grid-template-columns: 28px 1fr 20px; align-items: center; min-height: 44px; font-weight: 800; font-size: .86rem; }
.profile__logout { min-height: 52px; display: flex; align-items: center; justify-content: center; gap: var(--space-2); border: 2px solid #8f2929; border-radius: var(--radius-full); color: #8f2929; font-weight: 800; }
</style>
