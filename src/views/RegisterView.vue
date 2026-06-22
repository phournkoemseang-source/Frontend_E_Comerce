<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <h2>Create account</h2>
        <p>Start shopping in minutes</p>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <div class="field">
        <label>Name</label>
        <input v-model="form.name" type="text" placeholder="Your full name" />
      </div>

      <div class="field">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="you@email.com" />
      </div>

      <div class="field">
        <label>Password</label>
        <input v-model="form.password" type="password" placeholder="Min 6 characters" />
      </div>

      <button class="btn-submit" :disabled="loading" @click="handleRegister">
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>

      <p class="auth-footer">
        Already have an account?
        <RouterLink to="/login">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ name: '', email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = false
  router.push('/login')
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  padding: 2rem;
}

.auth-header {
  margin-bottom: 1.5rem;
}

.auth-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--lumina-gray-900);
  margin-bottom: 0.25rem;
}

.auth-header p {
  font-size: 0.875rem;
  color: var(--lumina-gray-500);
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--lumina-gray-700);
  margin-bottom: 0.375rem;
}

.field input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-sm);
  color: var(--lumina-gray-900);
  font-size: 0.875rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field input:focus {
  outline: none;
  border-color: #1D9E75;
  box-shadow: 0 0 0 3px rgba(29, 158, 117, 0.1);
}

.field input::placeholder {
  color: var(--lumina-gray-400);
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: #1D9E75;
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 0.5rem;
}

.btn-submit:hover {
  background: #0F6E56;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  font-size: 0.8125rem;
  color: var(--lumina-gray-500);
  margin-top: 1.5rem;
}

.auth-footer a {
  color: #1D9E75;
  font-weight: 600;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
