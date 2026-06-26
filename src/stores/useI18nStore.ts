import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Locale = 'en' | 'kh'

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref<Locale>((localStorage.getItem('locale') as Locale) || 'en')

  const translations = {
    en: {
      nav: {
        home: 'Home',
        products: 'Products',
        wishlist: 'Wishlist',
        orders: 'Orders',
        signIn: 'Sign In',
        profile: 'Profile',
      },
      home: {
        eyebrow: 'Fresh from admin catalog',
        shop: 'Shop',
        subtitle: 'Browse every product first. Save favorites and reviews after sign in.',
        giveNeed: 'Give All You Need',
        liveProducts: 'live products divided by category',
        searchPlaceholder: 'Search products',
        category: 'Category',
        allProduct: 'All Product',
        items: 'items',
        viewCategory: 'View category',
        addToCart: 'Add to Cart',
        buyNow: 'Buy Now',
        noReviews: 'No reviews',
        reviews: 'reviews',
        noProductsFound: 'No products found.',
      },
      orders: {
        currentCart: 'Current Cart',
        orderHistory: 'Order History',
        noOrders: 'No orders yet.',
        startShopping: 'Start Shopping',
        loadingOrders: 'Loading orders...',
        orderId: 'Order ID',
        status: 'Status',
        total: 'Total',
        placeOrder: 'Place Order',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        free: 'Free',
        signInToPlace: 'Sign in to place your order',
        signInToHistory: 'Sign in to view your order history.',
        successMsg: 'Order placed successfully!',
      }
    },
    kh: {
      nav: {
        home: 'ទំព័រដើម',
        products: 'ផលិតផល',
        wishlist: 'បញ្ជីប្រាថ្នា',
        orders: 'ការបញ្ជាទិញ',
        signIn: 'ចូលគណនី',
        profile: 'ប្រវត្តិរូប',
      },
      home: {
        eyebrow: 'ទើបតែដាក់ថ្មីៗពីកាតាឡុកអ្នកគ្រប់គ្រង',
        shop: 'ហាងទំនិញ',
        subtitle: 'រកមើលរាល់ផលិតផលមុនគេ។ រក្សាទុកផលិតផលដែលពេញចិត្ត និងការវាយតម្លៃបន្ទាប់ពីចូលគណនី។',
        giveNeed: 'ផ្តល់ជូនអ្វីៗគ្រប់យ៉ាងដែលអ្នកត្រូវការ',
        liveProducts: 'ផលិតផលកំពុងលក់បែងចែកតាមប្រភេទ',
        searchPlaceholder: 'ស្វែងរកផលិតផល...',
        category: 'ប្រភេទផលិតផល',
        allProduct: 'ផលិតផលទាំងអស់',
        items: 'ទំនិញ',
        viewCategory: 'មើលប្រភេទនេះ',
        addToCart: 'បន្ថែមទៅកន្ត្រក',
        buyNow: 'ទិញភ្លាមៗ',
        noReviews: 'មិនទាន់មានការវាយតម្លៃ',
        reviews: 'ការវាយតម្លៃ',
        noProductsFound: 'រកមិនឃើញផលិតផលទេ។',
      },
      orders: {
        currentCart: 'កន្ត្រកទំនិញបច្ចុប្បន្ន',
        orderHistory: 'ប្រវត្តិនៃការបញ្ជាទិញ',
        noOrders: 'មិនទាន់មានការបញ្ជាទិញឡើយ។',
        startShopping: 'ចាប់ផ្តើមទិញទំនិញ',
        loadingOrders: 'កំពុងទាញយកការបញ្ជាទិញ...',
        orderId: 'លេខបញ្ជាទិញ',
        status: 'ស្ថានភាព',
        total: 'សរុប',
        placeOrder: 'បញ្ជាទិញទំនិញ',
        subtotal: 'តម្លៃទំនិញសរុប',
        shipping: 'សេវាដឹកជញ្ជូន',
        free: 'ឥតគិតថ្លៃ',
        signInToPlace: 'សូមចូលគណនីដើម្បីធ្វើការបញ្ជាទិញ',
        signInToHistory: 'សូមចូលគណនីដើម្បីមើលប្រវត្តិនៃការបញ្ជាទិញរបស់អ្នក។',
        successMsg: 'បានបញ្ជាទិញដោយជោគជ័យ!',
      }
    }
  }

  function setLocale(newLocale: Locale) {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  function t(key: string) {
    const keys = key.split('.')
    let current: any = translations[locale.value]
    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k]
      } else {
        return key
      }
    }
    return current
  }

  return {
    locale,
    setLocale,
    t,
  }
})
