<template>
  <section class="hero fade-up" aria-label="Destaque principal">
    <div class="hero__card">
      <!-- Text content -->
      <div class="hero__content">
        <span class="hero__eyebrow">✨ Artesanal & Fresquinho</span>
        <h1 class="hero__headline">{{ data.headline }}</h1>
        <p class="hero__sub">{{ data.subtext }}</p>
        <button class="hero__cta" @click="$emit('cta-click')">
          {{ data.cta }}
          <span class="cta-arrow">→</span>
        </button>
      </div>

      <!-- Illustration -->
      <div class="hero__visual" aria-hidden="true">
        <div class="hero__emoji-stack">
          <span class="emoji-big spin-slow">🍪</span>
          <span class="emoji-medium float">🍫</span>
          <span class="emoji-small bounce">✨</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
defineEmits(['cta-click'])
</script>

<style scoped>
.hero {
  padding: var(--sp-4) var(--page-padding) var(--sp-6);
}

.hero__card {
  background: linear-gradient(135deg, var(--c-espresso) 0%, var(--c-cocoa) 60%, #5c2800 100%);
  border-radius: var(--r-xl);
  padding: var(--sp-8) var(--sp-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 200px;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-hero);
}

/* Decorative grain overlay */
.hero__card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04' /%3E%3C/svg%3E");
  border-radius: inherit;
  pointer-events: none;
}

/* Warm glow */
.hero__card::after {
  content: '';
  position: absolute;
  bottom: -40px;
  right: -20px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(201, 124, 47, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero__content {
  flex: 1;
  z-index: 1;
}

.hero__eyebrow {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-caramel-lt);
  margin-bottom: var(--sp-3);
}

.hero__headline {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.15;
  color: var(--c-cream);
  margin-bottom: var(--sp-2);
  letter-spacing: -0.02em;
}

.hero__sub {
  font-size: 0.8rem;
  color: rgba(255, 251, 245, 0.7);
  margin-bottom: var(--sp-5);
  line-height: 1.5;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  background: var(--c-caramel);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  padding: var(--sp-3) var(--sp-5);
  border-radius: var(--r-full);
  border: none;
  cursor: pointer;
  transition: transform var(--t-slow), background var(--t-fast), box-shadow var(--t-normal);
  box-shadow: 0 4px 16px rgba(201, 124, 47, 0.4);
}

.hero__cta:hover {
  background: var(--c-caramel-lt);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 124, 47, 0.5);
}

.hero__cta:active { transform: scale(0.97); }

.cta-arrow {
  display: inline-block;
  transition: transform var(--t-normal);
}
.hero__cta:hover .cta-arrow { transform: translateX(4px); }

/* Visual */
.hero__visual {
  flex-shrink: 0;
  margin-left: var(--sp-4);
  z-index: 1;
}

.hero__emoji-stack {
  position: relative;
  width: 90px;
  height: 90px;
}

.emoji-big {
  position: absolute;
  font-size: 3.5rem;
  top: 0;
  right: 0;
  line-height: 1;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
}

.emoji-medium {
  position: absolute;
  font-size: 1.8rem;
  bottom: 4px;
  left: 0;
  line-height: 1;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.emoji-small {
  position: absolute;
  font-size: 1rem;
  top: 8px;
  left: 10px;
}

/* Animations */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
}
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.3); }
}

.spin-slow { animation: spin-slow 12s linear infinite; }
.float     { animation: float 3s ease-in-out infinite; }
.bounce    { animation: bounce 2s ease-in-out infinite; }
</style>
