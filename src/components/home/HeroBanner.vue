<template>
  <section class="hero">
    <div class="hero__card">
      <div class="hero__content">
        <h1 class="hero__title">
          Cookies e
          brownies
          artesanais
        </h1>

        <AppButton
          variant="primary"
          size="md"
          class="hero__button"
          @click="scrollToProducts"
        >
          Compre agora
        </AppButton>
      </div>

      <div class="hero__image-wrap">
        <img
          :src="heroUrl"
          alt="Cookies e brownies artesanais Brookiê"
          class="hero__image"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import heroUrl from '@/assets/images/hero-products.png'
import AppButton from '@/components/common/AppButton.vue'

function scrollToProducts() {
  document.getElementById('produtos')?.scrollIntoView({
    behavior: 'smooth',
  })
}
</script>

<style scoped>
.hero {
  margin-bottom: 24px;
}

.hero__card {
  position: relative;

  min-height: 190px;

  background: #efb0a9;

  border-radius: 0 0 0 50px;

  padding: 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  overflow: hidden;
}

.hero__content {
  z-index: 2;

  display: flex;
  flex-direction: column;

  gap: 20px;

  width: 55%;
}

.hero__title {
  font-size: 2rem;
  line-height: 1.05;
  font-weight: 900;

  color: #3b1a08;
}

.hero__button {
  width: fit-content;
}

.hero__image-wrap {
  position: absolute;

  right: 10px;
  bottom: 0;

  width: 170px;
}

.hero__image {
  width: 100%;
  object-fit: contain;
}
</style>
