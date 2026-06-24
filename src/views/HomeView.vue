<template>
  <div class="home-shop">
    <section class="hero-shell">
      <div class="hero-media" :style="heroStyle">
        <div class="hero-copy">
          <span class="eyebrow">Fresh from admin catalog</span>
          <h1>Shop</h1>
          <p>Browse every product first. Save favorites and reviews after sign in.</p>
        </div>
        <div class="runway-track" aria-hidden="true">
          <div class="runway-line">
            <span>New season</span>
            <span>Fashion essentials</span>
            <span>Premium lifestyle</span>
            <span>Fast checkout</span>
            <span>New season</span>
            <span>Fashion essentials</span>
            <span>Premium lifestyle</span>
            <span>Fast checkout</span>
          </div>
        </div>
      </div>

      <div class="shop-panel">
        <div class="panel-head">
          <div>
            <h2>Give All You Need</h2>
            <p>{{ products.length }} live products divided by category</p>
          </div>
          <label class="search-box" aria-label="Search products">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="searchQuery" type="search" placeholder="Search products" />
          </label>
        </div>

        <ProductSkeletonGrid v-if="loading" />
        <div v-else-if="error" class="error-msg">{{ error }}</div>

        <div v-else class="catalog-layout">
          <aside class="category-rail">
            <h3>Category</h3>
            <button class="category-btn" :class="{ active: activeCat === 'All' }" @click="activeCat = 'All'">
              <span>All Product</span>
              <strong>{{ products.length }}</strong>
            </button>
            <button
              v-for="cat in categoryStats"
              :key="cat.name"
              class="category-btn"
              :class="{ active: activeCat === cat.name }"
              @click="activeCat = cat.name"
            >
              <span>{{ cat.name }}</span>
              <strong>{{ cat.count }}</strong>
            </button>
          </aside>

          <div class="product-space">
            <div v-if="visibleProducts.length === 0" class="empty-state compact">
              <p>No products found.</p>
            </div>

            <section v-for="group in visibleGroups" :key="group.name" class="category-section">
              <div class="section-heading">
                <div>
                  <span>{{ group.items.length }} items</span>
                  <h3>{{ group.name }}</h3>
                </div>
                <RouterLink :to="{ path: '/products', query: { category: group.name } }">View category</RouterLink>
              </div>

              <div class="products-grid">
                <article v-for="product in group.items" :key="product.id" class="product-card">
                  <RouterLink :to="`/products/${product.id}`" class="product-image">
                    <img v-if="product.image" :src="imageUrl(product.image)" :alt="product.name" />
                    <div v-else class="product-placeholder">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <span class="category-pill">{{ group.name }}</span>
                    <button class="heart-btn" :class="{ active: wishlistIds.includes(String(product.id)) }" @click.prevent="handleWishlist(product)" aria-label="Save to wishlist">
                      <svg width="18" height="18" viewBox="0 0 24 24" :fill="wishlistIds.includes(String(product.id)) ? '#111827' : 'none'" :stroke="wishlistIds.includes(String(product.id)) ? '#111827' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    </button>
                  </RouterLink>

                  <div class="product-info">
                    <RouterLink :to="`/products/${product.id}`" class="product-name">{{ product.name }}</RouterLink>
                    <button class="rating-row" @click="handleRating(product)">
                      <span class="star">★</span>
                      <template v-if="ratingSummary(product).count">
                        <span>{{ ratingSummary(product).average.toFixed(1) }}</span>
                        <small>({{ ratingSummary(product).count }} reviews)</small>
                      </template>
                      <span v-else>No reviews</span>
                    </button>
                    <div class="product-foot">
                      <strong>${{ Number(product.price).toFixed(2) }}</strong>
                      <div class="action-row">
                        <button class="btn-add" @click="handleAddToCart(product)">Add to Cart</button>
                        <button class="btn-buy" @click="handleBuyNow(product)">Buy Now</button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>

    <section v-if="recommendedProducts.length" class="recommend-section">
      <div class="wide-heading">
        <h2>Explore our recommendations</h2>
        <RouterLink to="/products">All products</RouterLink>
      </div>
      <div class="recommend-grid">
        <article v-for="product in recommendedProducts" :key="product.id" class="mini-card">
          <RouterLink :to="`/products/${product.id}`" class="mini-image">
            <img v-if="product.image" :src="imageUrl(product.image)" :alt="product.name" />
            <div v-else class="product-placeholder"></div>
          </RouterLink>
          <div>
            <span>{{ product.category?.name || 'Other' }}</span>
            <RouterLink :to="`/products/${product.id}`">{{ product.name }}</RouterLink>
            <strong>${{ Number(product.price).toFixed(2) }}</strong>
          </div>
        </article>
      </div>
    </section>

    <section class="editorial-banner">
      <img :src="fashionImage" alt="Fashion essentials in black white and gray" />
      <div>
        <span>Fashion edit</span>
        <h2>Clean essentials for every lifestyle store.</h2>
        <p>Stylish product showcase, smooth layout, and a premium shopping feel for fashion, electronics, and lifestyle products.</p>
      </div>
    </section>

    <section class="newsletter-band">
      <div>
        <h2>Ready to Get Our New Stuff?</h2>
        <p>New admin products appear here automatically, sorted into the right category.</p>
      </div>
      <form class="subscribe-form" @submit.prevent="showToast('Thanks for subscribing!')">
        <input type="email" placeholder="Your Email" required />
        <button>Send</button>
      </form>
    </section>

    <footer class="shop-footer">
      <div>
        <h3>About</h3>
        <RouterLink to="/products">Shop</RouterLink>
        <RouterLink to="/wishlist">Wishlist</RouterLink>
        <RouterLink to="/orders">Order History</RouterLink>
      </div>
      <div>
        <h3>Support</h3>
        <RouterLink to="/cart">Cart</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </div>
      <p>Copyright ©2026 ShopVue. All Rights Reserved.</p>
    </footer>

    <div v-if="toast" class="toast" :class="toast.type">{{ toast.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../axios'
import ProductSkeletonGrid from '../components/shop/ProductSkeletonGrid.vue'
import { fashionEditorialImage, heroBannerImage } from '../assets/images'
import { useAuthStore } from '../stores/useAuthStore'
import { useCartStore } from '../stores/useCartStore'
import { imageUrl, ratingSummary } from '../utils/catalog'

interface Review {
  rating: number
}

interface Product {
  id: string | number
  name: string
  price: number
  image?: string
  category?: { name?: string }
  reviews?: Review[]
}

interface WishlistItem {
  id: string | number
  product_id: string | number
  product?: Product
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const products = ref<Product[]>([])
const wishlistItems = ref<WishlistItem[]>([])
const activeCat = ref('All')
const searchQuery = ref('')
const loading = ref(true)
const error = ref<string | null>(null)
const toast = ref<{ message: string; type: string } | null>(null)

const wishlistIds = computed(() => wishlistItems.value.map(item => String(item.product_id)))

const categoryStats = computed(() => {
  const stats = new Map<string, number>()
  products.value.forEach(product => {
    const name = product.category?.name || 'Other'
    stats.set(name, (stats.get(name) || 0) + 1)
  })
  return Array.from(stats, ([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name))
})

const visibleProducts = computed(() => {
  const term = searchQuery.value.trim().toLowerCase()
  return products.value.filter(product => {
    const cat = product.category?.name || 'Other'
    const matchesCategory = activeCat.value === 'All' || cat === activeCat.value
    const matchesSearch = !term || product.name.toLowerCase().includes(term) || cat.toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  })
})

const visibleGroups = computed(() => {
  const groups = new Map<string, Product[]>()
  visibleProducts.value.forEach(product => {
    const cat = product.category?.name || 'Other'
    if (!groups.has(cat)) groups.set(cat, [])
    groups.get(cat)!.push(product)
  })
  return Array.from(groups, ([name, items]) => ({ name, items }))
})

const recommendedProducts = computed(() => [...products.value].slice(0, 6))

const heroStyle = computed(() => {
  return { backgroundImage: `linear-gradient(90deg, rgba(17,24,39,0.52), rgba(17,24,39,0.12)), url(${heroBannerImage})` }
})

const fashionImage = fashionEditorialImage

onMounted(async () => {
  await loadProducts()
  if (authStore.isLoggedIn) await loadWishlist()
})

async function loadProducts() {
  try {
    loading.value = true
    const res = await api.get('/products')
    const data = res.data.data || res.data
    products.value = data.data || data
  } catch {
    error.value = 'Failed to load products. Make sure Laravel is running.'
  } finally {
    loading.value = false
  }
}

async function loadWishlist() {
  try {
    const res = await api.get('/wishlist')
    const data = res.data.data || res.data
    wishlistItems.value = data.data || data
  } catch {
    const saved = localStorage.getItem('wishlist')
    wishlistItems.value = saved ? JSON.parse(saved) : []
  }
}

async function handleAddToCart(product: Product) {
  await cartStore.addToCart(String(product.id), { name: product.name, price: Number(product.price), image: product.image || '' })
  showToast('Added to cart!')
}

async function handleBuyNow(product: Product) {
  await handleAddToCart(product)
  router.push('/cart')
}

async function handleWishlist(product: Product) {
  if (!authStore.isLoggedIn) {
    goToLogin('Sign in to save wishlist items')
    return
  }

  const alreadySaved = wishlistIds.value.includes(String(product.id))
  if (alreadySaved) {
    wishlistItems.value = wishlistItems.value.filter(item => String(item.product_id) !== String(product.id))
  } else {
    wishlistItems.value.push({
      id: product.id,
      product_id: product.id,
      product,
    })
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlistItems.value))

  try {
    await api.post('/wishlist', { product_id: product.id })
  } catch {
    // Keep local wishlist responsive if the API is unavailable.
  }
}

function handleRating(product: Product) {
  if (!authStore.isLoggedIn) {
    goToLogin('Sign in to rate products')
    return
  }
  router.push(`/products/${product.id}`)
}

function goToLogin(message: string) {
  showToast(message, 'warn')
  setTimeout(() => {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
  }, 900)
}

function showToast(message: string, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 2500)
}
</script>

<style scoped>
.home-shop {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-shell {
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
}

.hero-media {
  min-height: 360px;
  background:
    linear-gradient(90deg, rgba(17, 24, 39, 0.28), rgba(255, 255, 255, 0.08)),
    linear-gradient(135deg, #f9fafb 0%, #e5e7eb 52%, #ffffff 100%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: end;
  padding: 2rem;
}

.hero-copy {
  max-width: 620px;
  color: #fff;
  text-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
}

.eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0;
  margin-bottom: 0.25rem;
  color: #f9fafb;
}

.hero-copy h1 {
  font-size: clamp(4rem, 15vw, 11rem);
  line-height: 0.85;
  font-weight: 800;
}

.hero-copy p {
  max-width: 420px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.84);
  margin-top: 1rem;
}

.shop-panel {
  padding: 1.5rem;
}

.panel-head,
.wide-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.25rem;
}

.panel-head h2,
.wide-heading h2,
.newsletter-band h2 {
  color: var(--lumina-gray-900);
  font-size: 1.75rem;
  font-weight: 800;
}

.panel-head p {
  color: var(--lumina-gray-500);
  font-size: 0.875rem;
}

.search-box {
  width: min(360px, 100%);
  height: 42px;
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  color: var(--lumina-gray-400);
  background: var(--lumina-white);
}

.search-box input {
  border: 0;
  outline: 0;
  flex: 1;
  font-size: 0.875rem;
  min-width: 0;
}

.catalog-layout {
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 1.5rem;
}

.category-rail {
  position: sticky;
  top: 84px;
  align-self: start;
}

.category-rail h3 {
  font-size: 1rem;
  font-weight: 800;
  color: var(--lumina-gray-900);
  margin-bottom: 0.75rem;
}

.category-btn {
  width: 100%;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-radius: 8px;
  padding: 0.625rem 0.75rem;
  color: var(--lumina-gray-500);
  font-size: 0.875rem;
  text-align: left;
}

.category-btn strong {
  min-width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: var(--lumina-gray-100);
  color: var(--lumina-gray-500);
  font-size: 0.75rem;
  font-weight: 800;
}

.category-btn:hover,
.category-btn.active {
  background: var(--lumina-gray-100);
  color: var(--lumina-gray-900);
}

.category-btn.active strong {
  background: #111827;
  color: #fff;
}

.product-space {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.875rem;
}

.section-heading span,
.mini-card span {
  display: block;
  font-size: 0.75rem;
  color: var(--lumina-gray-400);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0;
}

.section-heading h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--lumina-gray-900);
}

.section-heading a,
.wide-heading a {
  color: #111827;
  font-size: 0.875rem;
  font-weight: 700;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.product-card,
.mini-card {
  min-width: 0;
}

.product-image,
.mini-image {
  position: relative;
  display: flex;
  background: #F3F4F6;
  border-radius: 8px;
  overflow: hidden;
}

.product-image {
  aspect-ratio: 1 / 0.9;
  margin-bottom: 0.75rem;
}

.product-image img,
.mini-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.product-card:hover .product-image img,
.mini-card:hover .mini-image img {
  transform: scale(1.04);
}

.product-placeholder {
  width: 100%;
  height: 100%;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-pill {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  max-width: calc(100% - 1rem);
  border-radius: var(--radius-full);
  padding: 0.25rem 0.625rem;
  background: rgba(255, 255, 255, 0.92);
  color: var(--lumina-gray-900);
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.heart-btn {
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--lumina-gray-500);
}

.heart-btn:hover,
.heart-btn.active {
  color: #111827;
}

.product-name {
  display: block;
  color: var(--lumina-gray-900);
  font-size: 1rem;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating-row {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  min-height: 24px;
  color: var(--lumina-gray-500);
  font-size: 0.8125rem;
}

.rating-row small {
  color: var(--lumina-gray-400);
}

.star {
  color: #111827;
}

.product-foot {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 0.25rem;
}

.product-foot strong,
.mini-card strong {
  color: var(--lumina-gray-900);
  font-size: 1.125rem;
  font-weight: 800;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.btn-add,
.btn-buy {
  height: 36px;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 800;
}

.btn-add {
  border: 1px solid var(--lumina-gray-200);
  color: var(--lumina-gray-900);
  background: #fff;
}

.btn-buy {
  color: #fff;
  background: #111827;
}

.recommend-section {
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: 8px;
  padding: 1.5rem;
}

.editorial-banner {
  position: relative;
  min-height: 320px;
  border: 1px solid var(--lumina-gray-200);
  border-radius: 8px;
  overflow: hidden;
  background: var(--lumina-white);
}

.editorial-banner img {
  width: 100%;
  height: 100%;
  min-height: 320px;
  object-fit: cover;
  filter: grayscale(1);
}

.editorial-banner div {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0.12));
}

.editorial-banner span {
  color: var(--lumina-gray-500);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.editorial-banner h2 {
  max-width: 540px;
  color: #111827;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 0.95;
  font-weight: 900;
  margin-top: 0.5rem;
}

.editorial-banner p {
  max-width: 540px;
  color: var(--lumina-gray-500);
  font-weight: 600;
  margin-top: 1rem;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.mini-card {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.875rem;
  align-items: center;
}

.mini-image {
  aspect-ratio: 1 / 0.75;
}

.mini-card a {
  display: block;
  color: var(--lumina-gray-900);
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.newsletter-band {
  min-height: 190px;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
  border-radius: 8px;
  padding: 2rem;
  background: linear-gradient(135deg, #111827, #27272a);
  color: #fff;
}

.newsletter-band h2 {
  color: #fff;
  max-width: 420px;
}

.newsletter-band p {
  max-width: 460px;
  color: rgba(255, 255, 255, 0.72);
}

.subscribe-form {
  width: min(340px, 100%);
  height: 42px;
  border-radius: var(--radius-full);
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0.25rem;
}

.subscribe-form input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  padding: 0 0.875rem;
  color: var(--lumina-gray-900);
}

.subscribe-form button {
  height: 34px;
  padding: 0 1rem;
  border-radius: var(--radius-full);
  background: #111827;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 800;
}

.shop-footer {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 2rem;
  align-items: start;
  padding-bottom: 1rem;
  color: var(--lumina-gray-500);
}

.shop-footer h3 {
  color: var(--lumina-gray-900);
  font-size: 0.9375rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.shop-footer a {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.shop-footer p {
  font-size: 0.8125rem;
  align-self: end;
}

.compact {
  padding: 2rem 1rem;
}

.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 700;
  z-index: 999;
  background: #111827;
  color: #fff;
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.2s ease;
}

.toast.warn {
  background: #4B5563;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 980px) {
  .catalog-layout {
    grid-template-columns: 1fr;
  }

  .category-rail {
    position: static;
    display: flex;
    overflow-x: auto;
    gap: 0.5rem;
    padding-bottom: 0.25rem;
  }

  .category-rail h3 {
    display: none;
  }

  .category-btn {
    width: auto;
    flex: 0 0 auto;
  }

  .products-grid,
  .recommend-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .hero-media {
    min-height: 260px;
    padding: 1.25rem;
  }

  .shop-panel,
  .recommend-section {
    padding: 1rem;
  }

  .panel-head,
  .wide-heading,
  .newsletter-band {
    align-items: stretch;
    flex-direction: column;
  }

  .editorial-banner,
  .editorial-banner img {
    min-height: 420px;
  }

  .products-grid,
  .recommend-grid {
    grid-template-columns: 1fr;
  }

  .mini-card {
    grid-template-columns: 96px 1fr;
  }

  .shop-footer {
    grid-template-columns: 1fr 1fr;
  }

  .shop-footer p {
    grid-column: 1 / -1;
  }
}
</style>
