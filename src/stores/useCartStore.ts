import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../axios'

export interface CartProduct {
  id: string
  name: string
  description?: string
  price: number
  image: string
  category?: string
  status?: string
  size?: string
  color?: string
}

export interface CartItem {
  id: string
  quantity: number
  product: CartProduct
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
  const shipping = computed(() => subtotal.value > 0 ? 12.50 : 0)
  const taxRate = 0.08
  const tax = computed(() => subtotal.value * taxRate)
  const total = computed((): string => (subtotal.value + shipping.value + tax.value).toFixed(2))

  async function fetchCart() {
    if (!localStorage.getItem('token')) {
      const saved = localStorage.getItem('cart')
      if (saved) items.value = JSON.parse(saved)
      return
    }
    try {
      const res = await api.get('/cart')
      const data = res.data.data || res.data
      items.value = data.items || data
    } catch {
      const saved = localStorage.getItem('cart')
      if (saved) items.value = JSON.parse(saved)
    }
  }

  function persist() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  async function addToCart(productId: string, productData?: Partial<CartProduct>) {
    if (localStorage.getItem('token')) {
      try {
        await api.post('/cart', { product_id: productId })
      } catch { /* fallback to local-only */ }
    }
    const existing = items.value.find(i => String(i.id) === String(productId))
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({
        id: productId,
        quantity: 1,
        product: { id: productId, name: 'Item', price: 0, image: '', ...productData }
      })
    }
    persist()
  }

  function updateQty(cartItemId: string | number, quantity: number) {
    const item = items.value.find(i => String(i.id) === String(cartItemId))
    if (item) {
      item.quantity = Math.max(0, quantity)
      if (item.quantity === 0) removeItem(cartItemId)
    }
    persist()
  }

  function removeItem(cartItemId: string | number) {
    items.value = items.value.filter(i => String(i.id) !== String(cartItemId))
    persist()
  }

  function clearCart() {
    items.value = []
    localStorage.removeItem('cart')
  }

  return {
    items,
    count,
    subtotal,
    shipping,
    tax,
    total,
    fetchCart,
    addToCart,
    updateQty,
    removeItem,
    clearCart
  }
})
