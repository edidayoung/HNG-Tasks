<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-bold text-indigo-600">TicketFlow</h1>
          <div class="flex items-center gap-4">
            <span class="text-gray-600 hidden sm:inline">Welcome, {{ session?.name }}</span>
            <button @click="$emit('logout')" class="flex items-center gap-2 text-gray-600 hover:text-red-600 transition">
              <LogOut :size="20" />
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p class="text-xl text-gray-600">Overview of your ticket management system</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white rounded-xl shadow-md p-8 border-l-4 border-green-500">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-700">Open Tickets</h3>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <AlertCircle class="text-green-600" :size="24" />
            </div>
          </div>
          <p class="text-4xl font-bold text-gray-800">{{ openTickets }}</p>
          <p class="text-sm text-gray-500 mt-2">Awaiting attention</p>
        </div>

        <div class="bg-white rounded-xl shadow-md p-8 border-l-4 border-amber-500">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-700">In Progress</h3>
            <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Edit2 class="text-amber-600" :size="24" />
            </div>
          </div>
          <p class="text-4xl font-bold text-gray-800">{{ inProgressTickets }}</p>
          <p class="text-sm text-gray-500 mt-2">Being worked on</p>
        </div>

        <div class="bg-white rounded-xl shadow-md p-8 border-l-4 border-gray-500">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-700">Closed</h3>
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <CheckCircle class="text-gray-600" :size="24" />
            </div>
          </div>
          <p class="text-4xl font-bold text-gray-800">{{ closedTickets }}</p>
          <p class="text-sm text-gray-500 mt-2">Resolved tickets</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div class="relative z-10">
          <h3 class="text-3xl font-bold mb-4">Manage Your Tickets</h3>
          <p class="text-indigo-100 mb-6 text-lg">Create, view, edit, and delete tickets with our comprehensive ticket management system.</p>
          <button @click="$emit('navigate', 'tickets')" class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Go to Ticket Management
          </button>
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 text-white py-8 mt-20">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-400">&copy; 2025 TicketFlow. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue'
import { AlertCircle, Edit2, CheckCircle, LogOut } from 'lucide-vue-next'

export default {
  name: 'Dashboard',
  components: {
    AlertCircle,
    Edit2,
    CheckCircle,
    LogOut
  },
  props: {
    tickets: {
      type: Array,
      default: () => []
    },
    session: {
      type: Object,
      default: null
    }
  },
  emits: ['navigate', 'logout'],
  setup(props) {
    const openTickets = computed(() => 
      props.tickets.filter(t => t.status === 'open').length
    )
    const inProgressTickets = computed(() => 
      props.tickets.filter(t => t.status === 'in_progress').length
    )
    const closedTickets = computed(() => 
      props.tickets.filter(t => t.status === 'closed').length
    )

    return {
      openTickets,
      inProgressTickets,
      closedTickets
    }
  }
}
</script>