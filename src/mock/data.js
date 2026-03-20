/**
 * mock/data.js
 * --------------------------------------------------
 * Dados locais simulando respostas da futura API Django.
 *
 * INTEGRAÇÃO FUTURA (Django REST Framework):
 *   GET /api/v1/categories/   → categories
 *   GET /api/v1/products/     → products
 *   GET /api/v1/products/?featured=true → featuredProducts
 * --------------------------------------------------
 */

export const categories = [
  {
    id: 1,
    slug: 'cookies',
    label: 'Cookies',
    emoji: '🍪',
    color: '#f5d49a',
    description: 'Crocantes por fora, macios por dentro'
  },
  {
    id: 2,
    slug: 'brownies',
    label: 'Brownies',
    emoji: '🍫',
    color: '#c8906a',
    description: 'Densos, fudgy e irresistíveis'
  },
  {
    id: 3,
    slug: 'combos',
    label: 'Combos',
    emoji: '🎁',
    color: '#d4b8e0',
    description: 'Kits especiais para presentear'
  },
  {
    id: 4,
    slug: 'sazonais',
    label: 'Sazonais',
    emoji: '🌟',
    color: '#a8d8a8',
    description: 'Edições limitadas do mês'
  }
]

export const products = [
  {
    id: 1,
    slug: 'cookie-chocolate-belga',
    name: 'Cookie Chocolate Belga',
    category: 'cookies',
    price: 12.90,
    originalPrice: null,
    emoji: '🍪',
    badge: 'Mais pedido',
    description: 'Cookie artesanal com gotas de chocolate belga 70%',
    available: true
  },
  {
    id: 2,
    slug: 'brownie-fudge-classico',
    name: 'Brownie Fudge Clássico',
    category: 'brownies',
    price: 14.90,
    originalPrice: null,
    emoji: '🍫',
    badge: 'Destaque',
    description: 'Brownie denso e cremoso com cacau em pó premium',
    available: true
  },
  {
    id: 3,
    slug: 'cookie-amendoim-caramelo',
    name: 'Cookie Amendoim & Caramelo',
    category: 'cookies',
    price: 13.90,
    originalPrice: 15.90,
    emoji: '🥜',
    badge: 'Promoção',
    description: 'Cookie crocante com pasta de amendoim e caramelo salgado',
    available: true
  },
  {
    id: 4,
    slug: 'brownie-nutella',
    name: 'Brownie Nutella',
    category: 'brownies',
    price: 16.90,
    originalPrice: null,
    emoji: '🫙',
    badge: null,
    description: 'Brownie recheado com camadas generosas de Nutella',
    available: true
  },
  {
    id: 5,
    slug: 'cookie-red-velvet',
    name: 'Cookie Red Velvet',
    category: 'cookies',
    price: 13.50,
    originalPrice: null,
    emoji: '❤️',
    badge: 'Novo',
    description: 'Cookie macio com massa red velvet e cream cheese',
    available: true
  },
  {
    id: 6,
    slug: 'brownie-oreo',
    name: 'Brownie Oreo',
    category: 'brownies',
    price: 15.90,
    originalPrice: null,
    emoji: '⚫',
    badge: null,
    description: 'Brownie com pedaços de Oreo incorporados na massa',
    available: false
  }
]

export const featuredProducts = products.filter(p => p.badge !== null && p.available)

export const heroData = {
  headline: 'Cookies e brownies artesanais',
  subtext: 'Feitos com amor, entregues com cuidado ✨',
  cta: 'Comprar agora',
  emoji: '🍪🍫'
}
