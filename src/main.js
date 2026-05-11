import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './assets/styles/global.css'
import { registerSW } from 'virtual:pwa-register'

// Registra o Service Worker com atualização automática
registerSW({
  onNeedRefresh() {
    // Nova versão disponível — você pode trocar por um toast da sua UI
    if (confirm('Nova versão disponível! Deseja atualizar?')) {
      window.location.reload()
    }
  },
  onOfflineReady() {
    console.log('✅ App pronto para uso offline!')
  },
  onRegisterError(error) {
    console.error('Erro ao registrar Service Worker:', error)
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
