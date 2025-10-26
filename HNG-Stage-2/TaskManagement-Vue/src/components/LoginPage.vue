<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-200 opacity-30 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 opacity-30 rounded-full blur-3xl"></div>
    
    <div class="max-w-md w-full mx-4 relative z-10">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p class="text-gray-600">Login to access your dashboard</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              v-model="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              v-model="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
            <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Login
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Don't have an account?{' '}
            <button @click="$emit('navigate', 'signup')" class="text-indigo-600 font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </div>

        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-gray-700 font-semibold mb-1">Demo Credentials:</p>
          <p class="text-sm text-gray-600">Email: demo@example.com</p>
          <p class="text-sm text-gray-600">Password: demo123</p>
        </div>
      </div>

      <div class="text-center mt-6">
        <button @click="$emit('navigate', 'landing')" class="text-gray-600 hover:text-indigo-600 transition">
          ← Back to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'LoginPage',
  emits: ['login', 'navigate'],
  setup(props, { emit }) {
    const email = ref('')
    const password = ref('')
    const errors = ref({})

    const validate = () => {
      const newErrors = {}
      if (!email.value.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(email.value)) newErrors.email = 'Email is invalid'
      if (!password.value) newErrors.password = 'Password is required'
      else if (password.value.length < 6) newErrors.password = 'Password must be at least 6 characters'
      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
      if (validate()) {
        emit('login', email.value, password.value)
      }
    }

    return {
      email,
      password,
      errors,
      handleSubmit
    }
  }
}
</script>