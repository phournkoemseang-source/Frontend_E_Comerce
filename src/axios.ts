// src/axios.js
// ─────────────────────────────────────────────────────────
// This file connects Vue to Laravel.
// It automatically adds the token to every private request.
// Import this file in every Vue page that calls the API.
// ─────────────────────────────────────────────────────────

import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
})

// Runs BEFORE every request → attach token if it exists
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Runs AFTER every response → if 401, token is expired → logout
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            // lazy import to avoid circular dependency
            import('./router/index').then(router => {
                router.default.push('/login')
            })
        }
        return Promise.reject(error)
    }
)

export default api