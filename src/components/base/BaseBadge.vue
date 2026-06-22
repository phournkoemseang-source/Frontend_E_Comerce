<script setup lang="ts">
import { useCssModule } from 'vue'

interface Props {
  variant?: 'fashion' | 'home' | 'tech' | 'sports' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const styles = useCssModule()
</script>

<template>
  <span :class="[styles.badge, styles['variant-' + variant]]">
    <slot />
  </span>
</template>

<style module>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.variant-default {
  background-color: var(--lumina-gray-100);
  color: var(--lumina-gray-500);
}

.variant-fashion {
  background-color: var(--lumina-accent-mint);
  color: var(--lumina-accent-mint-text);
}

.variant-home {
  background-color: #FEF3C7;
  color: #92400E;
}

.variant-tech {
  background-color: var(--lumina-accent-blue);
  color: var(--lumina-accent-blue-text);
}

.variant-sports {
  background-color: var(--lumina-accent-orange);
  color: var(--lumina-accent-orange-text);
}
</style>
