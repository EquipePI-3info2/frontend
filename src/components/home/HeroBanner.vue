<template>
  <section class="hero" aria-label="Banner principal">
    <div class="container">
      <div class="hero__card">
        <!-- Conteúdo textual esquerdo -->
        <div class="hero__content">
          <h1 class="hero__title">
            Cookies e<br>brownies<br>artesanais
          </h1>
          <RouterLink to="/busca" class="hero__btn">
            Compre agora
          </RouterLink>
        </div>

        <!-- Imagem direita: posicionada para "flutuar" -->
        <div class="hero__image-wrap" aria-hidden="true">
          <img
            :src="heroUrl"
            alt="Cookies e brownies Brookiê"
            class="hero__image"
            width="190"
            height="175"
            loading="eager"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import heroUrl from '@/assets/images/hero-products.png'
</script>

<style scoped>
.hero {
  padding: var(--space-4) 0 var(--space-6);
}

/* Card hero: pêssego quente */
.hero__card {
  background-color: var(--color-hero-card);  /* #F6CDB4 */
  border-radius: 20px;
  padding: var(--space-6) 0 var(--space-6) var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  min-height: 185px;
  animation: fadeInUp 0.4s ease both;
}

/* Conteúdo textual */
.hero__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
  flex: 1;
  min-width: 0;
  z-index: 2;
}

/* Título */
.hero__title {
  font-size: clamp(1.25rem, 5vw, 1.5rem); /* ~20-24px */
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1.2;
  white-space: nowrap;  /* mantém a quebra manual do <br> */
}

/* Botão: dark brown, pill */
.hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);   /* #3B1A08 */
  color: var(--color-text-inverse);
  font-family: var(--font-family);
  font-size: 0.9375rem;  /* 15px */
  font-weight: 700;
  padding: 12px 22px;
  border-radius: var(--radius-full);
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color var(--transition-fast),
    transform        var(--transition-fast);
}

.hero__btn:hover  { background-color: var(--color-primary-light); }
.hero__btn:active { transform: scale(0.97); }

/* Imagem: lado direito, sangra verticalmente */
.hero__image-wrap {
  flex-shrink: 0;
  width: clamp(140px, 44%, 190px);
  align-self: stretch;
  display: flex;
  align-items: flex-end;
  padding-right: 0;
  margin-right: -4px;  /* leve sangria na borda direita */
}

.hero__image {
  width: 100%;
  height: auto;
  object-fit: contain;
  object-position: bottom right;
  filter: drop-shadow(0 6px 14px rgba(59, 26, 8, 0.20));
  transform-origin: bottom right;
  transform: rotate(2deg);
  transition: transform 0.4s ease;
}

.hero__card:hover .hero__image {
  transform: rotate(0deg) scale(1.04);
}
</style>
