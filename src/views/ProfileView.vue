<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">
        Profile
        <span class="badge-private">Private</span>
      </h2>
    </div>

    <div class="profile-layout">
      <div class="profile-card">
        <div class="avatar-row">
          <div class="avatar-big">{{ authStore.user?.name?.charAt(0).toUpperCase() }}</div>
          <div>
            <div class="user-name">{{ authStore.user?.name }}</div>
            <div class="user-email">{{ authStore.user?.email }}</div>
          </div>
        </div>

        <h3 class="card-title">Edit Profile</h3>

        <div v-if="profileSuccess" class="success-msg">Profile saved successfully.</div>
        <div v-if="profileError" class="error-msg">{{ profileError }}</div>

        <div class="field">
          <label>Name</label>
          <input v-model="profileForm.name" type="text" placeholder="Your name" />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="profileForm.email" type="email" placeholder="you@email.com" />
        </div>

        <button class="btn-save" :disabled="savingProfile" @click="saveProfile">
          {{ savingProfile ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>

      <div class="profile-card">
        <h3 class="card-title">Change Password</h3>

        <div v-if="pwSuccess" class="success-msg">Password updated successfully.</div>
        <div v-if="pwError" class="error-msg">{{ pwError }}</div>

        <div class="field">
          <label>Current Password</label>
          <input v-model="pwForm.current_password" type="password" placeholder="Enter current password" />
        </div>
        <div class="field">
          <label>New Password</label>
          <input v-model="pwForm.new_password" type="password" placeholder="Min 6 characters" />
        </div>
        <div class="field">
          <label>Confirm New Password</label>
          <input v-model="pwForm.confirm_password" type="password" placeholder="Repeat new password" />
        </div>

        <button class="btn-save" :disabled="savingPw" @click="changePassword">
          {{ savingPw ? 'Updating...' : 'Update Password' }}
        </button>
      </div>

      <div class="profile-card logout-card">
        <button class="btn-logout" @click="handleLogout">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const profileForm = reactive({ name: '', email: '' })
const savingProfile = ref(false)
const profileSuccess = ref(false)
const profileError = ref('')

const pwForm = reactive({ current_password: '', new_password: '', confirm_password: '' })
const savingPw = ref(false)
const pwSuccess = ref(false)
const pwError = ref('')

onMounted(() => {
  if (authStore.user) {
    profileForm.name = authStore.user?.name || ''
    profileForm.email = authStore.user.email
  }
})

async function saveProfile() {
  profileSuccess.value = false
  profileError.value = ''
  savingProfile.value = true

  try {
    authStore.updateProfile({
      name: profileForm.name,
      email: profileForm.email,
    })

    profileSuccess.value = true
    setTimeout(() => { profileSuccess.value = false }, 3000)
  } catch (e: any) {
    profileError.value = e.response?.data?.message || 'Failed to update profile.'
  } finally {
    savingProfile.value = false
  }
}

function changePassword() {
  pwSuccess.value = false
  pwError.value = ''

  if (pwForm.new_password !== pwForm.confirm_password) {
    pwError.value = 'New passwords do not match.'
    return
  }

  pwSuccess.value = true
  pwForm.current_password = ''
  pwForm.new_password = ''
  pwForm.confirm_password = ''
  setTimeout(() => { pwSuccess.value = false }, 3000)
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.profile-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 520px;
}

.profile-card {
  background: var(--lumina-white);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar-big {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #1D9E75;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-name {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--lumina-gray-900);
}

.user-email {
  font-size: 0.8125rem;
  color: var(--lumina-gray-500);
  margin-top: 0.125rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--lumina-gray-900);
  margin-bottom: 1rem;
}

.field {
  margin-bottom: 0.875rem;
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

.btn-save {
  width: 100%;
  padding: 0.625rem;
  background: #1D9E75;
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-save:hover {
  background: #0F6E56;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-logout {
  width: 100%;
  padding: 0.625rem;
  background: none;
  color: var(--lumina-gray-500);
  border: 1px solid var(--lumina-gray-200);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-logout:hover {
  background: #FEF2F2;
  border-color: #FECACA;
  color: #DC2626;
}
</style>
