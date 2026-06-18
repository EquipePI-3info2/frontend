<template>
  <div class="edit-profile">

    <!-- ── Cabeçalho ──────────────────────────────────────────────── -->
    <header class="edit-profile__header">
      <button class="btn-back" @click="router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Voltar
      </button>
      <h1 class="edit-profile__title">Editar perfil</h1>
      <span class="edit-profile__spacer" />
    </header>

    <!-- ── Card principal ─────────────────────────────────────────── -->
    <main class="edit-profile__card">

      <!-- Foto de perfil -->
      <section class="photo-section">
        <div
          class="avatar-wrapper"
          :class="{ 'avatar-wrapper--has-photo': displayPhoto }"
          @click="triggerFileInput"
          role="button"
          aria-label="Alterar foto de perfil"
          tabindex="0"
          @keydown.enter="triggerFileInput"
        >
          <img
            v-if="displayPhoto"
            :src="displayPhoto"
            alt="Foto de perfil"
            class="avatar-img"
          />
          <span v-else class="avatar-initials">{{ initials }}</span>

          <div class="avatar-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span>Alterar foto</span>
          </div>
        </div>

        <input
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style="display: none"
          @change="handlePhotoChange"
        />

        <div class="photo-actions">
          <span class="photo-hint">JPG, PNG ou WEBP · máx. 5 MB</span>
          <button
            v-if="displayPhoto"
            type="button"
            class="btn-remove-photo"
            @click.stop="markPhotoForRemoval"
          >
            Remover foto
          </button>
        </div>
      </section>

      <div class="divider" />

      <!-- Formulário -->
      <form class="profile-form" novalidate @submit.prevent="saveChanges">

        <div class="form-group">
          <label class="form-label" for="name">Nome completo</label>
          <input
            id="name"
            v-model.trim="form.name"
            type="text"
            class="form-input"
            :class="{ 'form-input--error': errors.name }"
            placeholder="Seu nome completo"
            autocomplete="name"
          />
          <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="email">
            E-mail
            <span class="form-label__badge">não editável</span>
          </label>
          <div class="form-input-locked">
            <input
              id="email"
              :value="authStore.user?.email"
              type="email"
              class="form-input form-input--locked"
              readonly
              tabindex="-1"
            />
            <svg class="lock-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="telefone">Telefone</label>
          <input
            id="telefone"
            v-model.trim="form.telefone"
            type="tel"
            class="form-input"
            placeholder="(47) 99999-0000"
            autocomplete="tel"
          />
        </div>

        <!-- Feedback global -->
        <transition name="fade">
          <div
            v-if="feedback.message"
            class="feedback"
            :class="`feedback--${feedback.type}`"
            role="alert"
          >
            <svg v-if="feedback.type === 'success'" xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ feedback.message }}
          </div>
        </transition>

        <!-- Botões -->
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner" aria-hidden="true" />
            {{ saving ? 'Salvando…' : 'Salvar alterações' }}
          </button>
          <button type="button" class="btn-secondary" :disabled="saving" @click="router.back()">
            Cancelar
          </button>
        </div>

      </form>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

// ── Setup ────────────────────────────────────────────────────────────────────

const router    = useRouter()
const authStore = useAuthStore()

// ── Refs ─────────────────────────────────────────────────────────────────────

const fileInputRef = ref(null)
const photoPreview = ref(null)   // URL.createObjectURL da nova foto escolhida
const photoFile    = ref(null)   // File object a ser enviado
const removePhoto  = ref(false)  // usuário pediu remoção da foto atual
const saving       = ref(false)

const form = reactive({
  name:     '',
  telefone: '',
})

const errors = reactive({
  name: '',
})

const feedback = reactive({
  type:    '',   // 'success' | 'error'
  message: '',
})

// ── Computed ──────────────────────────────────────────────────────────────────

/** Foto a exibir: preview local > foto do backend > nada */
const displayPhoto = computed(() => {
  if (removePhoto.value) return null
  if (photoPreview.value) return photoPreview.value
  return authStore.user?.profile_photo_url ?? null
})

const initials = computed(() => {
  const name = authStore.user?.name ?? ''
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
})

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(() => {
  form.name     = authStore.user?.name     ?? ''
  form.telefone = authStore.user?.telefone ?? ''
})

// ── Métodos de foto ───────────────────────────────────────────────────────────

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handlePhotoChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    showFeedback('error', 'A imagem não pode ser maior que 5 MB.')
    return
  }

  photoFile.value    = file
  photoPreview.value = URL.createObjectURL(file)
  removePhoto.value  = false
  clearFeedback()

  // Limpa o input para permitir selecionar o mesmo arquivo novamente
  event.target.value = ''
}

function markPhotoForRemoval() {
  photoPreview.value = null
  photoFile.value    = null
  removePhoto.value  = true
}

// ── Salvar ────────────────────────────────────────────────────────────────────

function validate() {
  errors.name = ''
  if (!form.name) {
    errors.name = 'O nome é obrigatório.'
    return false
  }
  return true
}

async function saveChanges() {
  if (!validate()) return

  saving.value = true
  clearFeedback()

  try {
    // 1. Foto: upload ou remoção (independente dos dados de texto)
    if (photoFile.value) {
      await authStore.uploadPhoto(photoFile.value)
      photoFile.value    = null
      photoPreview.value = null
    } else if (removePhoto.value) {
      await authStore.removePhoto()
      removePhoto.value = false
    }

    // 2. Dados de perfil (nome e telefone)
    await authStore.updateProfile({
      name:     form.name,
      telefone: form.telefone,
    })

    showFeedback('success', 'Perfil atualizado com sucesso!')
  } catch (err) {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.name?.[0] ||
      err?.response?.data?.telefone?.[0] ||
      'Erro ao salvar. Tente novamente.'
    showFeedback('error', msg)
  } finally {
    saving.value = false
  }
}

// ── Feedback ──────────────────────────────────────────────────────────────────

function showFeedback(type, message) {
  feedback.type    = type
  feedback.message = message
  if (type === 'success') {
    setTimeout(clearFeedback, 4000)
  }
}

function clearFeedback() {
  feedback.type    = ''
  feedback.message = ''
}
</script>

<style scoped>
/* ── Variáveis (alinhadas com a paleta Brookiê) ───────────────────────────── */
.edit-profile {
  --cream:          #fdf8f2;
  --brown-dark:     #2e1a0e;
  --brown-mid:      #6b3a2a;
  --brown-light:    #a0674e;
  --salmon:         #e07a5f;
  --salmon-hover:   #c96847;
  --salmon-light:   #f5e0d8;
  --border:         #e8d5c4;
  --border-focus:   #c96847;
  --text-primary:   #2e1a0e;
  --text-secondary: #7a5c4f;
  --text-muted:     #b08070;
  --white:          #ffffff;
  --error:          #c0392b;
  --error-bg:       #fdf0ef;
  --success:        #2d7a4f;
  --success-bg:     #edf7f1;
  --radius-sm:      6px;
  --radius-md:      12px;
  --radius-lg:      20px;
  --shadow:         0 2px 16px rgba(46, 26, 14, 0.08);

  min-height: 100vh;
  background: var(--cream);
  color: var(--text-primary);
  font-family: inherit;
}

/* ── Cabeçalho ────────────────────────────────────────────────────────────── */
.edit-profile__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
  max-width: 560px;
  margin: 0 auto;
}

.edit-profile__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--brown-dark);
  letter-spacing: -0.01em;
}

.edit-profile__spacer {
  width: 80px; /* espelha a largura do btn-back */
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--brown-mid);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.15s;
}
.btn-back:hover { color: var(--salmon); }

/* ── Card ─────────────────────────────────────────────────────────────────── */
.edit-profile__card {
  max-width: 560px;
  margin: 20px auto 40px;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
}

/* ── Seção de foto ────────────────────────────────────────────────────────── */
.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 24px 24px;
  gap: 14px;
}

.avatar-wrapper {
  position: relative;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: var(--salmon-light);
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid var(--border);
  transition: border-color 0.2s;
  outline: none;
}

.avatar-wrapper:hover,
.avatar-wrapper:focus-visible {
  border-color: var(--salmon);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: var(--salmon);
  user-select: none;
}

/* Overlay da câmera */
.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(46, 26, 14, 0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--white);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-wrapper:hover .avatar-overlay,
.avatar-wrapper:focus-visible .avatar-overlay {
  opacity: 1;
}

.photo-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.photo-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.btn-remove-photo {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--error);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.15s;
}
.btn-remove-photo:hover { opacity: 0.75; }

/* ── Divisor ──────────────────────────────────────────────────────────────── */
.divider {
  height: 1px;
  background: var(--border);
  margin: 0 24px;
}

/* ── Formulário ───────────────────────────────────────────────────────────── */
.profile-form {
  padding: 28px 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-label__badge {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--salmon-light);
  padding: 1px 7px;
  border-radius: 99px;
  letter-spacing: 0.01em;
}

.form-input {
  width: 100%;
  padding: 11px 14px;
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: var(--cream);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input::placeholder { color: var(--text-muted); }

.form-input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(201, 104, 71, 0.15);
  background: var(--white);
}

.form-input--error {
  border-color: var(--error);
}

.form-input--locked {
  color: var(--text-muted);
  cursor: default;
  padding-right: 38px;
}
.form-input--locked:focus {
  border-color: var(--border);
  box-shadow: none;
}

.form-input-locked {
  position: relative;
}

.lock-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.form-error {
  font-size: 0.78rem;
  color: var(--error);
  font-weight: 500;
}

/* ── Feedback ─────────────────────────────────────────────────────────────── */
.feedback {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
}

.feedback--success {
  background: var(--success-bg);
  color: var(--success);
  border: 1px solid #b7e3ca;
}

.feedback--error {
  background: var(--error-bg);
  color: var(--error);
  border: 1px solid #f0c0bb;
}

/* ── Botões de ação ───────────────────────────────────────────────────────── */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--white);
  background: var(--salmon);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  letter-spacing: 0.01em;
  font-family: inherit;
}

.btn-primary:hover:not(:disabled) { background: var(--salmon-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  width: 100%;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brown-mid);
  background: transparent;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  font-family: inherit;
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--brown-mid);
  color: var(--brown-dark);
}
.btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Spinner ──────────────────────────────────────────────────────────────── */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: var(--white);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Transição do feedback ────────────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* ── Responsivo ───────────────────────────────────────────────────────────── */
@media (max-width: 600px) {
  .edit-profile__card {
    margin: 12px 12px 32px;
    border-radius: var(--radius-md);
  }

  .edit-profile__header {
    padding: 16px 12px 0;
  }

  .profile-form {
    padding: 24px 20px 28px;
  }

  .photo-section {
    padding: 28px 20px 20px;
  }
}
</style>
