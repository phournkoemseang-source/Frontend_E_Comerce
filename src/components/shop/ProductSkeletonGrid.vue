<template>
  <div class="skeleton-wrap" aria-live="polite" aria-label="Loading products">
    <div class="skeleton-rail">
      <span v-for="item in 5" :key="`rail-${item}`"></span>
    </div>
    <div class="skeleton-products">
      <article v-for="item in count" :key="item" class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-actions">
          <span></span>
          <span></span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), {
  count: 6,
})
</script>

<style scoped>
.skeleton-wrap {
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 1.5rem;
}

.skeleton-rail,
.skeleton-products {
  min-width: 0;
}

.skeleton-rail {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-rail span,
.skeleton-image,
.skeleton-line,
.skeleton-actions span {
  position: relative;
  overflow: hidden;
  background: #E5E7EB;
}

.skeleton-rail span::after,
.skeleton-image::after,
.skeleton-line::after,
.skeleton-actions span::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
  animation: shimmer 1.35s infinite;
}

.skeleton-rail span {
  height: 42px;
  border-radius: 8px;
}

.skeleton-products {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.skeleton-card {
  min-width: 0;
}

.skeleton-image {
  aspect-ratio: 1 / 0.9;
  border-radius: 8px;
  margin-bottom: 0.875rem;
}

.skeleton-line {
  height: 14px;
  border-radius: var(--radius-full);
  margin-bottom: 0.625rem;
}

.skeleton-line.short {
  width: 62%;
}

.skeleton-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.875rem;
}

.skeleton-actions span {
  height: 36px;
  border-radius: var(--radius-full);
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 980px) {
  .skeleton-wrap {
    grid-template-columns: 1fr;
  }

  .skeleton-rail {
    flex-direction: row;
    overflow: hidden;
  }

  .skeleton-rail span {
    min-width: 130px;
  }

  .skeleton-products {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .skeleton-products {
    grid-template-columns: 1fr;
  }
}
</style>
