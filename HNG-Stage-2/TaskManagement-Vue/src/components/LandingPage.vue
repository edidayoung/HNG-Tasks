<template>
  <div class="min-h-screen">
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-bold text-indigo-600">TicketFlow</h1>
          <nav class="hidden md:flex gap-6">
            <button @click="$emit('navigate', 'login')" class="text-gray-600 hover:text-indigo-600 transition">Login</button>
            <button @click="$emit('navigate', 'signup')" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Get Started</button>
          </nav>
          <button class="md:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
            <X v-if="mobileMenuOpen" :size="24" />
            <Menu v-else :size="24" />
          </button>
        </div>
        <nav v-if="mobileMenuOpen" class="md:hidden pb-4 flex flex-col gap-3">
          <button @click="handleMobileNavigate('login')" class="text-gray-600 hover:text-indigo-600 transition text-left">Login</button>
          <button @click="handleMobileNavigate('signup')" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Get Started</button>
        </nav>
      </div>
    </header>

    <section class="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative z-10">
        <div class="max-w-3xl">
          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Manage Your Tickets with Ease</h2>
          <p class="text-xl sm:text-2xl mb-8 text-indigo-100">Streamline your workflow with our powerful ticket management system. Track, organize, and resolve tickets efficiently.</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <button @click="$emit('navigate', 'signup')" class="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">Get Started Free</button>
            <button @click="$emit('navigate', 'login')" class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition text-lg">Login</button>
          </div>
        </div>
      </div>
      
      <div class="absolute top-10 right-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-32 h-32 bg-purple-400 opacity-20 rounded-full"></div>
      
      <div class="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>

    <section class="py-20 bg-gray-50">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-3xl sm:text-4xl font-bold text-center mb-4">Why Choose TicketFlow?</h3>
        <p class="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">Everything you need to manage tickets effectively in one powerful platform.</p>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle class="text-green-600" :size="32" />
            </div>
            <h4 class="text-2xl font-semibold mb-4">Easy Tracking</h4>
            <p class="text-gray-600">Keep track of all your tickets in one centralized dashboard with real-time status updates.</p>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Edit2 class="text-blue-600" :size="32" />
            </div>
            <h4 class="text-2xl font-semibold mb-4">Quick Updates</h4>
            <p class="text-gray-600">Update ticket status and details instantly with our intuitive interface.</p>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle class="text-purple-600" :size="32" />
            </div>
            <h4 class="text-2xl font-semibold mb-4">Smart Notifications</h4>
            <p class="text-gray-600">Stay informed with instant notifications and never miss important updates.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white relative overflow-hidden">
      <div class="absolute top-0 left-0 w-96 h-96 bg-indigo-200 opacity-20 rounded-full blur-3xl"></div>
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h3 class="text-3xl sm:text-4xl font-bold mb-6">Ready to Get Started?</h3>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Join thousands of teams already using TicketFlow to manage their tickets efficiently.</p>
        <button @click="$emit('navigate', 'signup')" class="bg-indigo-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition text-lg">Create Your Account</button>
      </div>
    </section>

    <footer class="bg-gray-800 text-white py-8">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-400">&copy; 2025 TicketFlow. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'
import { CheckCircle, Edit2, AlertCircle, Menu, X } from 'lucide-vue-next'

export default {
  name: 'LandingPage',
  components: {
    CheckCircle,
    Edit2,
    AlertCircle,
    Menu,
    X
  },
  emits: ['navigate'],
  setup(props, { emit }) {
    const mobileMenuOpen = ref(false)

    const handleMobileNavigate = (page) => {
      emit('navigate', page)
      mobileMenuOpen.value = false
    }

    return {
      mobileMenuOpen,
      handleMobileNavigate
    }
  }
}
</script>