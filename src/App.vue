<template>
  <div class="app-wrapper">
    <nav class="navbar">
      <div class="container navbar-inner">
        <RouterLink to="/" class="brand">Shop<span>Vue</span></RouterLink>

        <div class="nav-links">
          <RouterLink to="/" class="nav-link" active-class="active">Home</RouterLink>
          <RouterLink to="/products" class="nav-link" active-class="active">Products</RouterLink>
          <RouterLink to="/wishlist" class="nav-link" active-class="active">Wishlist</RouterLink>
          <RouterLink to="/orders" class="nav-link" active-class="active">Orders</RouterLink>
        </div>

        <div class="nav-actions">
          <button class="cart-btn" @click="toggleCart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span v-if="cartStore.count > 0" class="cart-badge">{{ cartStore.count }}</span>
          </button>

          <RouterLink v-if="!authStore.isLoggedIn" to="/login" class="btn-primary-sm">Sign In</RouterLink>
          <RouterLink v-else to="/profile" class="profile-btn">
            <span class="avatar">{{ authStore.user?.name?.charAt(0).toUpperCase() }}</span>
          </RouterLink>
        </div>

        <CartDropdown :visible="cartOpen" @close="cartOpen = false" />
      </div>
    </nav>

    <main class="main-content">
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCartStore } from '@/stores/useCartStore'
import CartDropdown from '@/components/shop/CartDropdown.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
const cartOpen = ref(false)

function toggleCart() {
  cartOpen.value = !cartOpen.value
}

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchProfile()
    } catch {
      authStore.logout()
    }
  }
})
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--lumina-gray-50);
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--lumina-white);
  border-bottom: 1px solid var(--lumina-gray-200);
}

.navbar-inner {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 2rem;
}

.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--lumina-gray-900);
  text-decoration: none;
  flex-shrink: 0;
}

.brand span {
  color: #111827;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--lumina-gray-500);
  text-decoration: none;
  transition: all 0.15s;
}

.nav-link:hover {
  color: var(--lumina-gray-900);
  background: var(--lumina-gray-50);
}

.nav-link.active {
  color: #111827;
  background: var(--lumina-accent-mint);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}

.cart-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--lumina-gray-500);
  transition: all 0.15s;
}

.cart-btn:hover {
  color: var(--lumina-gray-900);
  background: var(--lumina-gray-50);
}

.cart-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #111827;
  color: #fff;
  font-size: 0.625rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  border: 2px solid var(--lumina-white);
}

.btn-primary-sm {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #111827;
  color: #fff;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
}

.btn-primary-sm:hover {
  background: #000000;
}

.profile-btn {
  text-decoration: none;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #111827;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 600;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
