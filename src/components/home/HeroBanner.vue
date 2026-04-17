<template>
  <section class="hero container">
    <div class="hero__card">
      <div class="hero__content">
        <h1 class="hero__title">Cookies e brownies artesanais</h1>
        <AppButton variant="primary" size="md" @click="scrollToProducts">
          Compre agora
        </AppButton>
      </div>
      <div class="hero__image-wrap">
        <img
          :src="heroUrl"
          alt="Cookies e brownies artesanais Brookiê"
          class="hero__image"
          width="180"
          height="160"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import heroUrl from '@/assets/images/hero-products.png'
import AppButton from '@/components/common/AppButton.vue'

function scrollToProducts() {
  document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero { padding-top: var(--space-4); padding-bottom: var(--space-2); }

.hero__card {
  background: var(--color-hero-card);
  border-radius: var(--radius-xl);
  padding: var(--space-6) var(--space-6) 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  overflow: hidden;
  min-height: 180px;
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-bottom: var(--space-6);
  flex: 1;
}

.hero__title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1.2;
  max-width: 16ch;
}

.hero__image-wrap {
  flex-shrink: 0;
  align-self: flex-end;
}

.hero__image {
  width: 160px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 8px 20px rgba(59,26,8,0.18));
  transform: rotate(2deg);
}
</style>
