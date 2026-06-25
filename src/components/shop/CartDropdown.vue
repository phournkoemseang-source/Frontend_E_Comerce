<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="cd-overlay" @click="close"></div>
    </Transition>
    <Transition name="slide">
      <div v-if="visible" class="cd-dropdown">
        <div class="cd-header">
          <h3 class="cd-title">Shopping Cart</h3>
          <button class="cd-close" @click="close">✕</button>
        </div>

        <div v-if="loading" class="cd-loading">
          <div class="cd-skeleton" v-for="n in 3" :key="n"></div>
        </div>

        <div v-else-if="items.length === 0" class="cd-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <p>Your cart is empty.</p>
        </div>

        <div v-else class="cd-body">
          <div class="cd-items">
            <div
              v-for="item in items"
              :key="item.id"
              class="cd-item"
              v-memo="[item.id, item.quantity, item.product?.price, item.product?.image]"
            >
              <div class="cd-item-img">
                <img
                  v-if="item.product?.image"
                  :src="`http://localhost:8000/storage/${item.product.image}`"
                  :alt="item.product?.name"
                  loading="lazy"
                />
                <div v-else class="cd-item-img-placeholder">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              </div>
              <div class="cd-item-info">
                <div class="cd-item-name">{{ item.product?.name }}</div>
                <div class="cd-item-price">${{ Number(item.product?.price).toFixed(2) }}</div>
              </div>
              <div class="cd-item-actions">
                <div class="cd-qty-group">
                  <button class="cd-qty-btn" @click="decrease(item)" :disabled="item.quantity <= 1 && items.length > 1">−</button>
                  <span class="cd-qty-val">{{ item.quantity }}</span>
                  <button class="cd-qty-btn" @click="increase(item)">+</button>
                </div>
                <button class="cd-del-btn" @click="remove(item.id)" aria-label="Remove">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="cd-summary">
            <div class="cd-summary-row">
              <span>Subtotal ({{ count }} items)</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="cd-summary-row cd-summary-total">
              <span>Total</span>
              <span>${{ total }}</span>
            </div>
          </div>

          <div class="cd-footer">
            <button class="cd-checkout-btn" :disabled="checkingOut" @click="goCheckout">
              {{ checkingOut ? 'Placing...' : 'Proceed to Checkout' }}
            </button>
            <button class="cd-view-cart-btn" @click="goViewCart">View Cart</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../axios'
import { useAuthStore } from '../../stores/useAuthStore'
import { useCartStore } from '../../stores/useCartStore'
import type { CartItem } from '../../stores/useCartStore'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const loading = ref(false)
const checkingOut = ref(false)

const items = computed(() => cartStore.items)
const count = computed(() => cartStore.count)
const subtotal = computed(() => cartStore.subtotal)
const total = computed(() => cartStore.total)

function close() {
  emit('close')
}

function increase(item: CartItem) {
  cartStore.updateQty(item.id, item.quantity + 1)
}

function decrease(item: CartItem) {
  if (item.quantity <= 1) {
    cartStore.removeItem(item.id)
  } else {
    cartStore.updateQty(item.id, item.quantity - 1)
  }
}

function remove(id: string | number) {
  cartStore.removeItem(id)
}

async function goCheckout() {
  if (!authStore.isLoggedIn) {
    emit('close')
    router.push({ path: '/login', query: { redirect: '/checkout' } })
    return
  }
  checkingOut.value = true
  try {
    await api.post('/checkout')
  } catch {
    // proceed locally
  }
  checkingOut.value = false
  cartStore.clearCart()
  emit('close')
  router.push('/orders')
}

function goViewCart() {
  emit('close')
  router.push('/cart')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  cartStore.fetchCart()
  document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.cd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
}

.cd-dropdown {
  position: fixed;
  top: 60px;
  right: 1rem;
  width: 380px;
  max-height: calc(100vh - 80px);
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  z-index: 201;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #F3F4F6;
}

.cd-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.cd-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.875rem;
}

.cd-close:hover {
  background: #F3F4F6;
  color: #111827;
}

.cd-body {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cd-items {
  overflow-y: auto;
  padding: 0.5rem 0;
  max-height: 320px;
}

.cd-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.25rem;
}

.cd-item-img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #F9FAFB;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cd-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cd-item-img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cd-item-info {
  flex: 1;
  min-width: 0;
}

.cd-item-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cd-item-price {
  font-size: 0.75rem;
  color: #6B7280;
  margin-top: 0.125rem;
}

.cd-item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cd-qty-group {
  display: flex;
  align-items: center;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  overflow: hidden;
}

.cd-qty-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F9FAFB;
  color: #6B7280;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  transition: all 0.1s;
}

.cd-qty-btn:hover {
  background: #E5E7EB;
  color: #111827;
}

.cd-qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cd-qty-val {
  width: 28px;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
}

.cd-del-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}

.cd-del-btn:hover {
  color: #111827;
  background: #F3F4F6;
}

.cd-summary {
  padding: 1rem 1.25rem;
  border-top: 1px solid #F3F4F6;
  background: #F9FAFB;
}

.cd-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6B7280;
  padding: 0.25rem 0;
}

.cd-summary-total {
  font-weight: 700;
  color: #111827;
  margin-top: 0.375rem;
}

.cd-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem 1rem;
  border-top: 1px solid #F3F4F6;
}

.cd-checkout-btn {
  width: 100%;
  padding: 0.625rem;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.cd-checkout-btn:hover {
  background: #000000;
}

.cd-checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cd-view-cart-btn {
  width: 100%;
  padding: 0.5rem;
  background: none;
  color: #111827;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.cd-view-cart-btn:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.cd-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2.5rem 1.25rem;
  color: #9CA3AF;
  font-size: 0.875rem;
}

.cd-loading {
  padding: 1.25rem;
}

.cd-skeleton {
  height: 68px;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease, opacity 0.15s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 420px) {
  .cd-dropdown {
    width: calc(100vw - 1.5rem);
    right: 0.75rem;
  }
}
</style>
