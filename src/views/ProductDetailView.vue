<template>
  <div>
    <RouterLink to="/" class="back-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      Back to Products
    </RouterLink>

    <div v-if="loading" class="loading">Loading product...</div>

    <div v-else-if="product" class="detail-layout">
      <div class="product-main">
        <div class="product-img-section">
          <img v-if="product.image" :src="`http://localhost:8000/storage/${product.image}`" :alt="product.name" class="product-img" />
          <div v-else class="product-img-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        </div>
        <div class="product-info-section">
          <div class="product-cat">{{ product.category?.name }}</div>
          <h1 class="product-name">{{ product.name }}</h1>
          <div class="product-price">${{ Number(product.price).toFixed(2) }}</div>
          <div class="action-row">
            <button class="btn-cart" @click="handleAddToCart">Add to Cart</button>
            <button class="btn-wish" :class="{ active: wishlisted }" @click="handleWishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" :fill="wishlisted ? '#DC2626' : 'none'" :stroke="wishlisted ? '#DC2626' : '#9CA3AF'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="reviews-section">
        <h3 class="reviews-title">Reviews ({{ product.reviews?.length || 0 }})</h3>

        <div v-if="authStore.isLoggedIn" class="review-form">
          <div class="stars-row">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= reviewForm.rating }" @click="reviewForm.rating = n">★</span>
          </div>
          <textarea v-model="reviewForm.comment" placeholder="Write your review..." class="review-textarea"></textarea>
          <button class="btn-review" :disabled="submitting" @click="submitReview">
            {{ submitting ? 'Submitting...' : 'Submit Review' }}
          </button>
        </div>
        <div v-else class="review-login-hint">
          <RouterLink to="/login">Sign in</RouterLink> to write a review.
        </div>

        <div v-if="!product.reviews?.length" class="no-reviews">No reviews yet.</div>
        <div v-else class="review-list">
          <div v-for="review in product.reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <span class="reviewer-name">{{ review.user?.name }}</span>
              <span class="review-stars">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast" :class="toast.type">{{ toast.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../axios'
import { useAuthStore } from '../stores/useAuthStore'
import { useCartStore } from '../stores/useCartStore'

interface Review {
  id: string | number
  rating: number
  comment: string
  user?: { name: string }
}

interface Product {
  id: string | number
  name: string
  price: number
  image: string
  category?: { name: string }
  reviews?: Review[]
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const wishlisted = ref(false)
const submitting = ref(false)
const toast = ref<{ message: string; type: string } | null>(null)
const reviewForm = reactive({ rating: 5, comment: '' })

onMounted(async () => {
   try {
     const res = await api.get(`/products/${route.params.id}`)
     product.value = res.data.data || res.data
      if (authStore.isLoggedIn) {
       try {
         const wRes = await api.get('/wishlist')
         const wData = wRes.data.data || wRes.data
         wishlisted.value = (wData.data || wData).some((w: any) => w.product_id === product.value!.id)
       } catch {
         // wishlist endpoint not available
       }
     }
   } catch (e) {
     product.value = null
   } finally {
     loading.value = false
   }
 })

async function handleAddToCart() {
  const p = product.value!
  await cartStore.addToCart(String(p.id), { name: p.name, price: p.price, image: p.image })
  showToast('Added to cart!')
}

async function handleWishlist() {
    if (!authStore.isLoggedIn) {
     showToast('Please sign in to use wishlist', 'warn')
     setTimeout(() => router.push('/login'), 1500)
     return
   }
   wishlisted.value = !wishlisted.value
   let saved: any[] = []
   try { saved = JSON.parse(localStorage.getItem('wishlist') || '[]') } catch {}
   if (wishlisted.value) {
     const p = product.value!
     saved.push({
       id: p.id,
       product_id: p.id,
       product: { id: p.id, name: p.name, price: p.price, image: p.image }
     })
   } else {
     saved = saved.filter((i: any) => String(i.product_id) !== String(product.value!.id))
   }
   localStorage.setItem('wishlist', JSON.stringify(saved))
   try {
     await api.post('/wishlist', { product_id: product.value!.id })
   } catch {
     // backend not available, toggled locally
   }
 }

async function submitReview() {
  submitting.value = true
  try {
    await api.post('/reviews', {
      product_id: product.value!.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    })
    const fresh = await api.get(`/products/${route.params.id}`)
    product.value = fresh.data
    reviewForm.comment = ''
    showToast('Review submitted!')
  } catch (e) {
    showToast('Failed to submit review', 'error')
  } finally {
    submitting.value = false
  }
}

function showToast(message: string, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 2500)
}
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--lumina-gray-500);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color 0.15s;
}

.back-link:hover {
  color: var(--lumina-gray-900);
}

.detail-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-main {
  display: flex;
  gap: 2rem;
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.product-img-section {
  width: 200px;
  height: 200px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--lumina-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-info-section {
  flex: 1;
}

.product-cat {
  font-size: 0.8125rem;
  color: #1D9E75;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.375rem;
}

.product-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lumina-gray-900);
  margin-bottom: 0.75rem;
}

.product-price {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--lumina-gray-900);
  margin-bottom: 1.5rem;
}

.action-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-cart {
  padding: 0.75rem 1.5rem;
  background: #1D9E75;
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-cart:hover {
  background: #0F6E56;
}

.btn-wish {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--lumina-gray-200);
  background: var(--lumina-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-wish:hover {
  border-color: #FCA5A5;
  background: #FEF2F2;
}

.btn-wish.active {
  border-color: #FCA5A5;
  background: #FEF2F2;
}

.reviews-section {
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.reviews-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--lumina-gray-900);
  margin-bottom: 1.25rem;
}

.review-form {
  background: var(--lumina-gray-50);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-sm);
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.stars-row {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.star {
  font-size: 1.5rem;
  color: var(--lumina-gray-300);
  cursor: pointer;
  transition: color 0.1s;
}

.star.filled {
  color: #F59E0B;
}

.review-textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-sm);
  color: var(--lumina-gray-900);
  font-size: 0.875rem;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.15s;
}

.review-textarea:focus {
  outline: none;
  border-color: #1D9E75;
}

.btn-review {
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
  background: #1D9E75;
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-review:hover {
  background: #0F6E56;
}

.btn-review:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.review-login-hint {
  font-size: 0.875rem;
  color: var(--lumina-gray-500);
  margin-bottom: 1rem;
}

.review-login-hint a {
  color: #1D9E75;
  font-weight: 600;
}

.no-reviews {
  font-size: 0.875rem;
  color: var(--lumina-gray-400);
  text-align: center;
  padding: 1.5rem;
}

.review-card {
  background: var(--lumina-gray-50);
  border-radius: var(--radius-sm);
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.reviewer-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--lumina-gray-900);
}

.review-stars {
  color: #F59E0B;
  font-size: 0.875rem;
}

.review-comment {
  font-size: 0.875rem;
  color: var(--lumina-gray-500);
  line-height: 1.5;
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
  background: #1D9E75;
  color: #fff;
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.2s ease;
}

.toast.warn {
  background: #F59E0B;
  color: #fff;
}

.toast.error {
  background: #DC2626;
  color: #fff;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 640px) {
  .product-main {
    flex-direction: column;
    gap: 1rem;
  }
  .product-img-section {
    width: 100%;
    height: 220px;
  }
}
</style>
