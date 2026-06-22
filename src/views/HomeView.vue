<template>
  <div>
    <div class="hero">
      <div class="hero-text">
        <h1>Best Quality,<br>Best Price</h1>
        <p>Browse products freely. Sign in only when you're ready to order.</p>
        <RouterLink to="/products" class="btn-primary">Shop Now</RouterLink>
      </div>
      <div class="hero-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      </div>
    </div>

    <h2 class="section-title">Quick access</h2>
    <div class="quick-grid">
      <RouterLink to="/products" class="quick-card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        <span>Products</span>
      </RouterLink>
      <RouterLink to="/wishlist" class="quick-card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <span>Wishlist</span>
      </RouterLink>
      <RouterLink to="/cart" class="quick-card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <span>Cart</span>
      </RouterLink>
      <RouterLink to="/orders" class="quick-card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <span>Orders</span>
      </RouterLink>
      <RouterLink to="/profile" class="quick-card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Profile</span>
      </RouterLink>
    </div>

    <div class="info-card">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <span>Products &amp; Search are public — no login needed. Cart, Checkout, Orders, and Profile require sign in.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero {
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.hero-text h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--lumina-gray-900);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.hero-text p {
  font-size: 0.9375rem;
  color: var(--lumina-gray-500);
  margin-bottom: 1.25rem;
}

.hero-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.2s;
  color: var(--lumina-gray-500);
  font-size: 0.875rem;
  font-weight: 500;
}

.quick-card:hover {
  border-color: #1D9E75;
  box-shadow: var(--shadow-md);
  color: var(--lumina-gray-900);
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: var(--lumina-accent-mint);
  border: 1px solid #A7F3D0;
  border-radius: var(--radius-sm);
  padding: 0.875rem 1rem;
  font-size: 0.8125rem;
  color: var(--lumina-accent-mint-text);
  line-height: 1.5;
}

.info-card svg {
  flex-shrink: 0;
  margin-top: 2px;
}

@media (max-width: 640px) {
  .hero {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 2rem 1.5rem;
  }

  .hero-icon {
    display: none;
  }

  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
