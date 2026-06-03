# 🍪 Brookie – E-commerce Mobile-First

> Cookies e brownies artesanais. Vue 3 + Vite + Pinia + PWA.

---

## 🚀 Rodando o projeto

```bash
npm install
npm run dev
```

Acesse: `http://localhost:5173`

Para build de produção (com PWA):
```bash
npm run build
npm run preview
```

---

## 📁 Estrutura de pastas

```
src/
├── assets/
│   └── styles/
│       └── global.css          # Design tokens (CSS custom properties) + reset
│
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue       # Header sticky com logo, carrinho, hambúrguer
│   │   └── BottomNav.vue       # Navegação inferior fixa (5 itens)
│   │
│   ├── ui/
│   │   ├── HeroBanner.vue      # Seção hero com CTA
│   │   └── ToastContainer.vue  # Notificações toast (Teleport)
│   │
│   ├── category/
│   │   ├── CategoryList.vue    # Container com scroll horizontal
│   │   └── CategoryItem.vue    # Card individual de categoria
│   │
│   └── product/
│       ├── ProductList.vue     # Grid 2 colunas + skeleton loading
│       └── ProductCard.vue     # Card reutilizável com add ao carrinho
│
├── composables/
│   └── useToast.js             # Toast notification state (singleton)
│
├── mock/
│   └── data.js                 # Dados mockados (substitui futura API Django)
│
├── router/
│   └── index.js                # Vue Router com lazy loading
│
├── services/
│   └── api.js                  # Camada de serviço (mock → Django REST)
│
├── stores/
│   ├── cart.js                 # Pinia: carrinho com persistência localStorage
│   └── products.js             # Pinia: categorias e produtos em destaque
│
└── views/
    ├── HomeView.vue            # Home montando todos os components
    ├── CatalogView.vue         # Stub (futura listagem completa)
    ├── CartView.vue            # Carrinho funcional
    ├── SearchView.vue          # Stub (futura busca)
    ├── ProfileView.vue         # Stub (futura autenticação)
    └── ProductView.vue         # Stub (futura página de produto)
```

---

## 🏗️ Decisões arquiteturais

### 1. Separação de responsabilidades
- **Views**: orquestram components, conectam stores, sem lógica de negócio
- **Components**: recebem dados via props, emitem eventos, zero acoplamento com stores (exceto quando são "smart components" como ProductCard que acessa o CartStore diretamente por ser sempre reutilizado com o mesmo comportamento)
- **Stores (Pinia)**: fonte única de verdade por domínio (cart, products)
- **Services**: abstração da camada HTTP – troca mock por fetch real sem tocar nas views

### 2. Integração futura com Django REST Framework
O arquivo `src/services/api.js` é o único ponto de troca. Para conectar ao backend:

```js
// services/api.js – troca mock por fetch real
const BASE_URL = import.meta.env.VITE_API_URL // ex: http://localhost:8000/api/v1

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products/`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  return { data: await res.json(), error: null }
}
```

**Endpoints Django esperados:**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/products/` | Lista produtos |
| GET | `/api/v1/products/?featured=true` | Mais vendidos |
| GET | `/api/v1/products/:slug/` | Detalhe do produto |
| GET | `/api/v1/categories/` | Categorias |
| POST | `/api/v1/cart/sync/` | Sincroniza carrinho local |
| POST | `/api/v1/auth/token/` | Login JWT (SimpleJWT) |

### 3. PWA
- `vite-plugin-pwa` gera service worker com Workbox automaticamente
- Manifest com shortcuts, ícones e orientação portrait
- Service worker com `NetworkFirst` para cache da API Django
- Carrinho persiste em `localStorage` para funcionar offline

### 4. Mobile-first real
- `max-width: 480px` no `#app` com `margin: 0 auto`
- `dvh` (dynamic viewport height) para suporte a browsers mobile modernos
- `safe-area-inset-bottom` no bottom nav para notch/home indicator do iOS
- Scroll horizontal nativo no carrossel de categorias (sem biblioteca)
- `-webkit-tap-highlight-color: transparent` em todos os interativos

### 5. Design System via CSS Custom Properties
Todas as cores, espaçamentos, sombras e tipografias estão em `:root` no `global.css`. Mudança de tema = mudar variáveis.

---

## 🔌 Variáveis de ambiente

Crie `.env.local` na raiz:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 📦 Dependências

| Pacote | Versão | Uso |
|--------|--------|-----|
| vue | ^3.4 | Framework |
| vue-router | ^4.3 | Roteamento |
| pinia | ^2.1 | Estado global |
| vite | ^5.0 | Build tool |
| @vitejs/plugin-vue | ^5.0 | Plugin Vue p/ Vite |
| vite-plugin-pwa | ^0.19 | PWA + Service Worker |
