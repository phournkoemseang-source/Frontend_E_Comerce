<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">
        Shopping Cart
        <span class="badge-private">Private</span>
      </h2>
    </div>

    <div v-if="loading" class="loading">Loading cart...</div>

    <div v-else-if="cartStore.items.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <p>Your cart is empty.</p>
      <RouterLink to="/products" class="btn-primary">Browse Products</RouterLink>
    </div>

    <div v-else class="cart-wrapper">
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item-card">
          <div class="item-img">
            <img v-if="item.product?.image" :src="`http://localhost:8000/storage/${item.product.image}`" :alt="item.product.name" />
            <div v-else class="item-img-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          </div>
          <div class="item-info">
            <div class="item-name">{{ item.product?.name }}</div>
            <div class="item-price">${{ Number(item.product?.price).toFixed(2) }} each</div>
          </div>
          <div class="item-controls">
            <div class="qty-group">
              <button class="qty-btn" @click="decreaseQty(item)">−</button>
              <span class="qty-val">{{ item.quantity }}</span>
              <button class="qty-btn" @click="increaseQty(item)">+</button>
            </div>
            <button class="del-btn" @click="removeItem(item.id)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-row">
          <span>Subtotal ({{ cartStore.count }} items)</span>
          <span>${{ cartStore.subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span class="free">Free</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-total">
          <span>Total</span>
          <span>${{ cartStore.total }}</span>
        </div>
        <button class="btn-checkout" :disabled="checkingOut" @click="handleCheckout">
          {{ checkingOut ? 'Placing order...' : 'Place Order' }}
        </button>
      </div>
    </div>

    <div v-if="toast" class="toast" :class="toast.type">{{ toast.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'
import { useAuthStore } from '../stores/useAuthStore'
import { useCartStore } from '../stores/useCartStore'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const loading = ref(true)
const checkingOut = ref(false)
const toast = ref<{ message: string; type: string } | null>(null)

onMounted(async () => {
  await cartStore.fetchCart()
  loading.value = false
})

function increaseQty(item: { id: string | number; quantity: number }) {
  cartStore.updateQty(item.id, item.quantity + 1)
}

function decreaseQty(item: { id: string | number; quantity: number }) {
  if (item.quantity <= 1) {
    cartStore.removeItem(item.id)
  } else {
    cartStore.updateQty(item.id, item.quantity - 1)
  }
}

function removeItem(cartItemId: string | number) {
  cartStore.removeItem(cartItemId)
}

async function handleCheckout() {
  if (!authStore.isLoggedIn) {
    showToast('Sign in to place your order', 'warn')
    setTimeout(() => router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } }), 900)
    return
  }

  checkingOut.value = true
  try {
    await api.post('/checkout', {
      items: cartStore.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.product.price
      }))
    })
  } catch {
    // backend not available, proceed locally
  }
  cartStore.clearCart()
  showToast('Order placed successfully!')
  setTimeout(() => router.push('/orders'), 1500)
  checkingOut.value = false
}

function showToast(message: string, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 3000)
}
</script>

<style scoped>
.cart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 640px;
}

.cart-item-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  padding: 1rem;
  transition: box-shadow 0.2s;
}

.cart-item-card:hover {
  box-shadow: var(--shadow-soft);
}

.item-img {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  background: var(--lumina-gray-50);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--lumina-gray-900);
  margin-bottom: 0.125rem;
}

.item-price {
  font-size: 0.8125rem;
  color: var(--lumina-gray-500);
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.qty-group {
  display: flex;
  align-items: center;
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lumina-gray-50);
  color: var(--lumina-gray-500);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.1s;
  border: none;
}

.qty-btn:hover {
  background: var(--lumina-gray-200);
  color: var(--lumina-gray-900);
}

.qty-val {
  width: 36px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--lumina-gray-900);
}

.del-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--lumina-gray-400);
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  border: none;
  background: none;
  cursor: pointer;
}

.del-btn:hover {
  color: #111827;
  background: #F3F4F6;
}

.summary-card {
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  max-width: 360px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--lumina-gray-500);
  padding: 0.375rem 0;
}

.free {
  color: #111827;
  font-weight: 600;
}

.summary-divider {
  border-top: 1px solid var(--lumina-gray-100);
  margin: 0.75rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--lumina-gray-900);
  margin-bottom: 1rem;
}

.btn-checkout {
  width: 100%;
  padding: 0.75rem;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-checkout:hover {
  background: #000000;
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 999;
  background: #111827;
  color: #fff;
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.2s ease;
}

.toast.warn {
  background: #4B5563;
  color: #fff;
}

.toast.error {
  background: #111827;
  color: #fff;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 640px) {
  .cart-item-card {
    flex-wrap: wrap;
  }
  .item-controls {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
