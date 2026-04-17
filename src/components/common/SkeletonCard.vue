<template>
  <div class="skeleton-card" aria-hidden="true">
    <div class="skeleton skeleton-image" />
    <div class="skeleton-body">
      <div class="skeleton skeleton-title" />
      <div class="skeleton skeleton-price" />
      <div class="skeleton skeleton-btn" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.skeleton {
  background: linear-gradient(
    90deg,
    #f0d9d0 25%,
    #faeae4 50%,
    #f0d9d0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
.skeleton-image { height: 148px; border-radius: 0; }
.skeleton-body  { padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
.skeleton-title { height: 14px; width: 75%; }
.skeleton-price { height: 14px; width: 45%; }
.skeleton-btn   { height: 36px; border-radius: var(--radius-full); margin-top: 0.25rem; }
</style>
