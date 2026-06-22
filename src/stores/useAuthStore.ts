import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../axios'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref(localStorage.getItem('token'))
  const showLoginModal = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  async function login(credentials: { email: string; password: string }) {
    const res = await api.post('/login', credentials)
    const data = res.data.data || res.data
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', token.value!)
    showLoginModal.value = false
  }

  async function register(credentials: { name: string; email: string; password: string }) {
    const res = await api.post('/register', credentials)
    const data = res.data.data || res.data
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', token.value!)
  }

  async function fetchProfile() {
    const res = await api.get('/profile')
    const data = res.data.data || res.data
    user.value = data.user || data
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  async function updateProfile(updates: Partial<User>) {
    const res = await api.put('/profile', updates)
    const data = res.data.data || res.data
    user.value = data.user || data
  }

  return {
    user,
    token,
    showLoginModal,
    isLoggedIn,
    login,
    register,
    fetchProfile,
    logout,
    updateProfile
  }
})
