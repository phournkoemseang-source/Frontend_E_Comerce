<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">
        Wishlist
        <span class="badge-private">Private</span>
      </h2>
    </div>

    <div v-if="loading" class="loading">Loading wishlist...</div>

    <div v-else-if="items.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      <p>No saved items yet.</p>
      <RouterLink to="/products" class="btn-primary">Browse Products</RouterLink>
    </div>

    <div v-else class="products-grid">
      <div v-for="item in items" :key="item.id" class="product-card wishlisted">
        <div class="product-img">
          <img v-if="item.product?.image" :src="`http://localhost:8000/storage/${item.product.image}`" :alt="item.product.name" />
          <div v-else class="product-placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        </div>
        <div class="product-body">
          <div class="product-name">{{ item.product?.name }}</div>
          <div class="product-price">${{ Number(item.product?.price).toFixed(2) }}</div>
          <div class="product-actions">
            <button class="btn-add" @click="addToCart(item)">Add to Cart</button>
            <button class="btn-wish active" @click="removeFromWishlist(item)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#111827" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../axios'
import { useCartStore } from '../stores/useCartStore'

interface WishlistItem {
  id: string | number
  product_id: string | number
  product: {
    id: string | number
    name: string
    price: number
    image: string
  }
}

const cartStore = useCartStore()
const items = ref<WishlistItem[]>([])
const loading = ref(true)
const toast = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await api.get('/wishlist')
    const data = res.data.data || res.data
    items.value = data.data || data
  } catch {
    const saved = localStorage.getItem('wishlist')
    if (saved) items.value = JSON.parse(saved)
  } finally {
    loading.value = false
  }
})

function persistWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(items.value))
}

async function removeFromWishlist(item: WishlistItem) {
  try {
    await api.post('/wishlist', { product_id: item.product_id })
  } catch {
    // backend not available, remove locally
  }
  items.value = items.value.filter(i => i.id !== item.id)
  persistWishlist()
  showToast('Removed from wishlist')
}

async function addToCart(item: WishlistItem) {
  const p = item.product
  await cartStore.addToCart(String(p.id), { name: p.name, price: p.price, image: p.image })
  showToast('Added to cart!')
}

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = null }, 2000)
}
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.product-card {
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.2s;
}

.product-card.wishlisted {
  border-color: #D1D5DB;
}

.product-card:hover {
  box-shadow: var(--shadow-md);
}

.product-img {
  background: var(--lumina-gray-50);
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-body {
  padding: 0.875rem;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--lumina-gray-900);
  margin-bottom: 0.375rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--lumina-gray-900);
  margin-bottom: 0.75rem;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-add {
  flex: 1;
  padding: 0.5rem 0;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-add:hover {
  background: #000000;
}

.btn-wish {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  border: 1px solid #D1D5DB;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
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

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  .product-img {
    height: 120px;
  }
}
</style>
