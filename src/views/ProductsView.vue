<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">
        Products
        <span class="badge-public">Public</span>
      </h2>
    </div>

    <div class="search-bar">
      <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input v-model="searchQuery" @input="onSearch" type="text" placeholder="Search products..." class="search-input" />
    </div>

    <div class="cat-row">
      <button v-for="cat in categories" :key="cat" class="cat-btn" :class="{ active: activeCat === cat }" @click="filterByCategory(cat)">
        {{ cat }}
      </button>
    </div>

    <div v-if="loading" class="loading">Loading products...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>

    <div v-else class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card" :class="{ wishlisted: wishlistIds.includes(product.id) }">
        <div class="product-img">
          <img v-if="product.image" :src="`http://localhost:8000/storage/${product.image}`" :alt="product.name" />
          <div v-else class="product-placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        </div>
        <div class="product-body">
          <div class="product-name">{{ product.name }}</div>
          <div class="product-cat">{{ product.category?.name }}</div>
          <div class="product-price">${{ Number(product.price).toFixed(2) }}</div>
          <div class="product-actions">
            <button class="btn-add" @click="handleAddToCart(product)">Add to Cart</button>
            <button class="btn-wish" :class="{ active: wishlistIds.includes(product.id) }" @click="handleWishlist(product)">
              <svg width="16" height="16" viewBox="0 0 24 24" :fill="wishlistIds.includes(product.id) ? '#111827' : 'none'" :stroke="wishlistIds.includes(product.id) ? '#111827' : '#D1D5DB'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && filteredProducts.length === 0" class="empty-state">
      <p>No products found.</p>
    </div>

    <div v-if="toast" class="toast" :class="toast.type">{{ toast.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../axios'
import { useAuthStore } from '../stores/useAuthStore'
import { useCartStore } from '../stores/useCartStore'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category?: { name: string }
}

interface WishlistItem {
  id: string
  product_id: string
  product: { id: string; name: string; price: number; image: string }
}

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()

const products = ref<Product[]>([])
const categories = ref<string[]>(['All'])
const activeCat = ref('All')
const searchQuery = ref('')
const wishlistItems = ref<WishlistItem[]>([])
const wishlistIds = computed(() => wishlistItems.value.map(i => i.product_id))
const loading = ref(true)
const error = ref<string | null>(null)
const toast = ref<{ message: string; type: string } | null>(null)

const filteredProducts = computed(() => {
  let list = products.value
  if (activeCat.value !== 'All') {
    list = list.filter(p => p.category?.name === activeCat.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }
  return list
})

onMounted(async () => {
   await loadProducts()
   if (authStore.isLoggedIn) {
     await loadWishlist()
   }
 })

async function loadProducts() {
  try {
    loading.value = true
    const res = await api.get('/products')
    const data = res.data.data || res.data
    products.value = data.data || data
    const cats = [...new Set(products.value.map((p: any) => p.category?.name).filter(Boolean))] as string[]
    categories.value = ['All', ...cats]
    if (typeof route.query.category === 'string' && categories.value.includes(route.query.category)) {
      activeCat.value = route.query.category
    }
  } catch (e) {
    error.value = 'Failed to load products. Make sure Laravel is running.'
  } finally {
    loading.value = false
  }
}

async function loadWishlist() {
  if (!localStorage.getItem('token')) {
    const saved = localStorage.getItem('wishlist')
    if (saved) wishlistItems.value = JSON.parse(saved)
    return
  }
  try {
    const res = await api.get('/wishlist')
    const data = res.data.data || res.data
    wishlistItems.value = data.data || data
  } catch {
    const saved = localStorage.getItem('wishlist')
    if (saved) wishlistItems.value = JSON.parse(saved)
  }
}

function filterByCategory(cat: string) {
  activeCat.value = cat
  searchQuery.value = ''
}

function onSearch() {
  activeCat.value = 'All'
}

async function handleAddToCart(product: any) {
  await cartStore.addToCart(product.id, { name: product.name, price: product.price, image: product.image })
  showToast('Added to cart!')
}

async function handleWishlist(product: Product) {
  if (!authStore.isLoggedIn) {
    showToast('Please sign in to use wishlist', 'warn')
    setTimeout(() => router.push({ path: '/login', query: { redirect: route.fullPath } }), 900)
    return
  }
  const toggledOff = wishlistItems.value.find(i => i.product_id === product.id)
  if (toggledOff) {
    wishlistItems.value = wishlistItems.value.filter(i => i.product_id !== product.id)
  } else {
    wishlistItems.value.push({
      id: product.id,
      product_id: product.id,
      product: { id: product.id, name: product.name, price: product.price, image: product.image }
    })
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlistItems.value))
  try {
    await api.post('/wishlist', { product_id: product.id })
  } catch {
    // backend not available, already saved locally
  }
}

function showToast(message: string, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 2500)
}
</script>

<style scoped>
.search-bar {
  position: relative;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--lumina-gray-400);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.5rem;
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-sm);
  color: var(--lumina-gray-900);
  font-size: 0.875rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-input:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(29, 158, 117, 0.1);
}

.search-input::placeholder {
  color: var(--lumina-gray-400);
}

.cat-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.cat-btn {
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--lumina-gray-200);
  background: var(--lumina-white);
  color: var(--lumina-gray-500);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.cat-btn:hover {
  border-color: #111827;
  color: #111827;
}

.cat-btn.active {
  background: #111827;
  border-color: #111827;
  color: #fff;
}

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

.product-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--lumina-gray-300);
}

.product-card.wishlisted {
  border-color: #D1D5DB;
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
  margin-bottom: 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-cat {
  font-size: 0.75rem;
  color: #111827;
  font-weight: 500;
  margin-bottom: 0.5rem;
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
  align-items: center;
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
  border: 1px solid var(--lumina-gray-200);
  background: var(--lumina-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-wish:hover {
  border-color: #D1D5DB;
  background: #F3F4F6;
}

.btn-wish.active {
  border-color: #D1D5DB;
  background: #F3F4F6;
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
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  .product-img {
    height: 120px;
  }
}
</style>
