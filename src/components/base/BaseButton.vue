<script setup lang="ts">
import { useCssModule } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

const styles = useCssModule()
</script>

<template>
  <button 
    :class="[
      styles.btn, 
      styles['variant-' + variant], 
      styles['size-' + size],
      loading ? styles.loading : ''
    ]"
    :disabled="disabled || loading"
  >
    <slot v-if="!loading" />
    <span v-else :class="styles.loader"></span>
  </button>
</template>

<style module>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: all 0.2s;
  border: 1px solid transparent;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.variant-primary {
  background-color: var(--lumina-black);
  color: var(--lumina-white);
}

.variant-primary:hover:not(:disabled) {
  opacity: 0.85;
}

.variant-secondary {
  background-color: var(--lumina-gray-100);
  color: var(--lumina-black);
}

.variant-secondary:hover:not(:disabled) {
  background-color: var(--lumina-gray-200);
}

.variant-outline {
  background-color: transparent;
  border-color: var(--lumina-gray-200);
  color: var(--lumina-black);
}

.variant-outline:hover:not(:disabled) {
  background-color: var(--lumina-gray-50);
}

.variant-ghost {
  background-color: transparent;
  color: var(--lumina-gray-500);
}

.variant-ghost:hover:not(:disabled) {
  background-color: var(--lumina-gray-50);
  color: var(--lumina-black);
}

/* Sizes */
.size-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
}

.size-md {
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
}

.size-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.loader {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
