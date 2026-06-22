<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">
        Checkout
        <span class="badge-private">Private</span>
      </h2>
    </div>

    <div v-if="loading" class="loading">Loading cart...</div>

    <div v-else-if="cartStore.items.length === 0" class="empty-state">
      <p>Your cart is empty.</p>
      <RouterLink to="/products" class="btn-primary">Browse Products</RouterLink>
    </div>

    <div v-else class="checkout-layout">
      <div class="checkout-card">
        <h3 class="card-title">Order Summary</h3>
        <div v-for="item in cartStore.items" :key="item.id" class="checkout-item">
          <span class="ci-name">{{ item.product?.name }}</span>
          <span class="ci-qty">×{{ item.quantity }}</span>
          <span class="ci-price">${{ (item.product?.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="divider"></div>
        <div class="checkout-total">
          <span>Total</span>
          <span>${{ cartStore.total }}</span>
        </div>
      </div>

      <div v-if="success" class="success-msg">Order placed! Redirecting to your orders...</div>
      <div v-if="error" class="error-msg">{{ error }}</div>

      <button class="btn-place" :disabled="placing || success" @click="placeOrder">
        {{ placing ? 'Placing order...' : 'Confirm & Place Order' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../axios'
import { useCartStore } from '../stores/useCartStore'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(true)
const placing = ref(false)
const success = ref(false)
const error = ref('')

onMounted(async () => {
  await cartStore.fetchCart()
  loading.value = false
})

async function placeOrder() {
  placing.value = true
  error.value = ''
  try {
    await api.post('/checkout')
    cartStore.clearCart()
    success.value = true
    setTimeout(() => router.push('/orders'), 2000)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Checkout failed.'
  } finally {
    placing.value = false
  }
}
</script>

<style scoped>
.checkout-layout {
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkout-card {
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--lumina-gray-900);
  margin-bottom: 1rem;
}

.checkout-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
}

.ci-name {
  flex: 1;
  color: var(--lumina-gray-900);
}

.ci-qty {
  color: var(--lumina-gray-400);
}

.ci-price {
  font-weight: 600;
  color: var(--lumina-gray-900);
  min-width: 60px;
  text-align: right;
}

.divider {
  border-top: 1px solid var(--lumina-gray-100);
  margin: 0.75rem 0;
}

.checkout-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--lumina-gray-900);
}

.btn-place {
  width: 100%;
  padding: 0.75rem;
  background: #1D9E75;
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-place:hover {
  background: #0F6E56;
}

.btn-place:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
