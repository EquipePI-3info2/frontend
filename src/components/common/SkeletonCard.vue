<template>
  <article class="skeleton-card" aria-hidden="true">
    <div class="skeleton-card__image skeleton" />
    <div class="skeleton-card__body">
      <div class="skeleton-card__name skeleton" />
      <div class="skeleton-card__price skeleton" />
      <div class="skeleton-card__btn skeleton" />
    </div>
  </article>
</template>

<style scoped>
.skeleton-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.skeleton-card__image {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 0;
}
.skeleton-card__body {
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.skeleton-card__name  { height: 1rem;   width: 75%; border-radius: var(--radius-sm); }
.skeleton-card__price { height: 0.875rem; width: 45%; border-radius: var(--radius-sm); }
.skeleton-card__btn   { height: 36px;   width: 100%; border-radius: var(--radius-full); margin-top: var(--space-2); }
</style>
