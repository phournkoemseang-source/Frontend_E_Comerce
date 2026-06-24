<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">
        Order History
        <span class="badge-private">Private</span>
      </h2>
    </div>

    <div v-if="loading" class="loading">Loading orders...</div>

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
        <div class="order-items">
          {{ order.items?.map(i => `${i.product?.name} ×${i.quantity}`).join(' · ') }}
        </div>
        <div class="order-footer">
          <span class="order-date">{{ formatDate(order.created_at) }}</span>
          <span class="order-total">${{ Number(order.total_amount).toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../axios'

interface Order {
  id: string | number
  status: string
  items: Array<{ product?: { name: string }; quantity: number }>
  created_at: string
  total_amount: number
}

const orders = ref<Order[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/orders')
    const data = res.data.data || res.data
    orders.value = data.data || data
  } catch (e) {
    orders.value = []
  } finally {
    loading.value = false
  }
})

function formatDate(dateString: string) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}
</script>

<style scoped>
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
  background: var(--lumina-accent-mint);
  color: var(--lumina-accent-mint-text);
}

.order-badge.completed {
  background: #111827;
  color: #fff;
}

.order-badge.cancelled {
  background: #F3F4F6;
  color: #111827;
}

.order-items {
  font-size: 0.8125rem;
  color: var(--lumina-gray-500);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
