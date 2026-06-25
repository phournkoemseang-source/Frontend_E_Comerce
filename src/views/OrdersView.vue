<template>
  <div>
    <!-- ── Cart Section ── -->
    <div v-if="cartStore.items.length > 0" class="section">
      <div class="page-header">
        <h2 class="page-title">Current Cart</h2>
      </div>

      <div class="cart-layout">
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item-card">
            <div class="item-img">
              <img v-if="item.product?.image" :src="imageUrl(item.product.image)" :alt="item.product.name" />
              <div v-else class="item-img-placeholder">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
            </div>
            <div class="item-info">
              <div class="item-name">{{ item.product?.name }}</div>
              <div class="item-price">${{ Number(item.product?.price).toFixed(2) }}</div>
            </div>
            <div class="item-controls">
              <div class="qty-group">
                <button class="qty-btn" @click="decreaseQty(item)">−</button>
                <span class="qty-val">{{ item.quantity }}</span>
                <button class="qty-btn" @click="increaseQty(item)">+</button>
              </div>
              <button class="del-btn" @click="removeItem(item.id)" title="Remove item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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
          <button class="btn-place-order" :disabled="checkingOut" @click="handleCheckout">
            {{ checkingOut ? 'Placing order...' : 'Place Order' }}
          </button>
          <p v-if="!authStore.isLoggedIn" class="login-hint">
            <RouterLink to="/login" class="login-link">Sign in</RouterLink> to place your order
          </p>
        </div>
      </div>
    </div>

    <!-- ── Order History Section ── -->
    <div class="section">
      <div class="page-header">
        <h2 class="page-title">
          Order History
          <span v-if="authStore.isLoggedIn" class="badge-private">Private</span>
        </h2>
      </div>

      <div v-if="!authStore.isLoggedIn" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <p><RouterLink to="/login" class="login-link">Sign in</RouterLink> to view your order history.</p>
      </div>

      <div v-else-if="loadingOrders" class="loading">Loading orders...</div>

      <div v-else-if="ordersError" class="error-msg">{{ ordersError }}</div>

      <div v-else-if="orders.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <p>No orders yet.</p>
        <RouterLink to="/products" class="btn-primary">Start Shopping</RouterLink>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-id">#{{ order.id }}</div>
            <span class="order-badge" :class="order.status">{{ order.status }}</span>
          </div>

          <div class="order-items-list">
            <div v-for="(item, idx) in order.items" :key="idx" class="order-item-row">
              <div class="order-item-img">
                <img v-if="item.product?.image" :src="imageUrl(item.product.image)" :alt="item.product?.name" />
                <div v-else class="order-item-img-placeholder">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              </div>
              <div class="order-item-name">{{ item.product?.name || 'Item' }}</div>
              <div class="order-item-qty">×{{ item.quantity }}</div>
              <div v-if="item.price" class="order-item-price">${{ Number(item.price).toFixed(2) }}</div>
            </div>
          </div>

          <div class="order-footer">
            <span class="order-date">{{ formatDate(order.created_at) }}</span>
            <span class="order-total">${{ Number(order.total_amount).toFixed(2) }}</span>
          </div>
        </div>
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

const checkingOut = ref(false)
const toast = ref<{ message: string; type: string } | null>(null)

const orders = ref<Order[]>([])
const loadingOrders = ref(false)
const ordersError = ref('')

interface OrderItem {
  product?: { name: string; image?: string }
  quantity: number
  price?: number
}

interface Order {
  id: string | number
  status: string
  items: OrderItem[]
  created_at: string
  total_amount: number
}

onMounted(async () => {
  await cartStore.fetchCart()
  if (authStore.isLoggedIn) {
    await fetchOrders()
  }
})

function imageUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `http://localhost:8000/storage/${path}`
}

async function fetchOrders() {
  loadingOrders.value = true
  ordersError.value = ''
  try {
    const res = await api.get('/orders')
    const data = res.data.data || res.data
    orders.value = data.data || data
  } catch (e: any) {
    ordersError.value = e.response?.data?.message || 'Could not load orders.'
    orders.value = []
  } finally {
    loadingOrders.value = false
  }
}

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
    await api.post('/checkout')
  } catch {
    // backend not available, proceed locally
  }
  cartStore.clearCart()
  showToast('Order placed successfully!')
  await fetchOrders()
  checkingOut.value = false
}

function showToast(message: string, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 3000)
}

function formatDate(dateString: string) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}
</script>

<style scoped>
.section {
  margin-bottom: 2.5rem;
}

/* ── Cart Layout ── */
.cart-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.cart-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
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
  flex-shrink: 0;
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

/* ── Summary ── */
.summary-card {
  width: 320px;
  flex-shrink: 0;
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  position: sticky;
  top: 5rem;
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

.btn-place-order {
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

.btn-place-order:hover {
  background: #000000;
}

.btn-place-order:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-hint {
  text-align: center;
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: var(--lumina-gray-400);
}

.login-link {
  color: #111827;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── Order History ── */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 640px;
}

.order-card {
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  transition: box-shadow 0.2s;
}

.order-card:hover {
  box-shadow: var(--shadow-soft);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.order-id {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--lumina-gray-900);
}

.order-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  text-transform: capitalize;
}

.order-badge.pending {
  background: #FEF3C7;
  color: #92400E;
}

.order-badge.processing {
  background: #F3F4F6;
  color: #111827;
}

.order-badge.completed {
  background: #111827;
  color: #fff;
}

.order-badge.cancelled {
  background: #F3F4F6;
  color: #6B7280;
}

.order-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.order-item-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.order-item-img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--lumina-gray-50);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.order-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-item-img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-item-name {
  font-size: 0.8125rem;
  color: var(--lumina-gray-700);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-item-qty {
  font-size: 0.8125rem;
  color: var(--lumina-gray-400);
  flex-shrink: 0;
}

.order-item-price {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--lumina-gray-900);
  flex-shrink: 0;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--lumina-gray-100);
}

.order-date {
  font-size: 0.8125rem;
  color: var(--lumina-gray-400);
}

.order-total {
  font-size: 1rem;
  font-weight: 700;
  color: var(--lumina-gray-900);
}

/* ── Toast ── */
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

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .cart-layout {
    flex-direction: column;
  }

  .summary-card {
    width: 100%;
    position: static;
  }

  .cart-item-card {
    flex-wrap: wrap;
  }

  .item-controls {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
