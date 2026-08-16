<template>
  <section v-if="loading || kits.length || error" class="kit-section container">
    <div class="kit-section__heading">
      <div><p>Economize</p><h2>Kits em promoção</h2></div>
      <Gift :size="24" />
    </div>

    <div v-if="loading" class="kit-section__grid">
      <SkeletonCard v-for="n in 2" :key="n" />
    </div>
    <div v-else-if="error" class="kit-section__state">
      <p>{{ error }}</p>
      <AppButton variant="outline" size="sm" @click="store.fetchKits()">Tentar novamente</AppButton>
    </div>
    <div v-else class="kit-section__grid">
      <KitCard v-for="(kit, index) in kits" :key="kit.id" :kit="kit" :index="index" />
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { Gift } from 'lucide-vue-next'
import AppButton from '@/components/common/AppButton.vue'
import KitCard from '@/components/common/KitCard.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import { useKitStore } from '@/stores/useKitStore'

const store = useKitStore()
const { kits, loading, error } = storeToRefs(store)
</script>

<style scoped>
.kit-section { padding-block: var(--space-5) var(--space-2); }
.kit-section__heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3); }
.kit-section__heading p { color: var(--color-text-muted); font-size: .68rem; font-weight: 900; text-transform: uppercase; letter-spacing: .07em; }
.kit-section__heading h2 { font-size: 1.1rem; }
.kit-section__heading svg { color: var(--color-accent); }
.kit-section__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
.kit-section__state { padding: var(--space-4); background: white; border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-2); color: var(--color-text-muted); font-size: .8rem; }
@media (max-width: 380px) { .kit-section__grid { grid-template-columns: 1fr; } }
</style>
