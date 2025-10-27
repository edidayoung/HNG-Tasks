<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden py-12">
    <div class="absolute top-0 left-0 w-96 h-96 bg-purple-200 opacity-30 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 opacity-30 rounded-full blur-3xl"></div>
    
    <div class="max-w-md w-full mx-4 relative z-10">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p class="text-gray-600">Sign up to get started with Ticketlify</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              v-model="name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

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

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              v-model="confirmPassword"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
          </div>

          <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Create Account
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Already have an account?{' '}
            <button @click="$emit('navigate', 'login')" class="text-indigo-600 font-semibold hover:underline">
              Login
            </button>
          </p>
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
  name: 'SignupPage',
  emits: ['signup', 'navigate'],
  setup(props, { emit }) {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const errors = ref({})

    const validate = () => {
      const newErrors = {}
      if (!name.value.trim()) newErrors.name = 'Name is required'
      if (!email.value.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(email.value)) newErrors.email = 'Email is invalid'
      if (!password.value) newErrors.password = 'Password is required'
      else if (password.value.length < 6) newErrors.password = 'Password must be at least 6 characters'
      if (password.value !== confirmPassword.value) newErrors.confirmPassword = 'Passwords do not match'
      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
      if (validate()) {
        emit('signup', email.value, password.value, name.value)
      }
    }

    return {
      name,
      email,
      password,
      confirmPassword,
      errors,
      handleSubmit
    }
  }
}
</script>