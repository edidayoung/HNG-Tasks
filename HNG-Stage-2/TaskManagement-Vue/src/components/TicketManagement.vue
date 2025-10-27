<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-bold text-indigo-600">Ticketlify</h1>
          <div class="flex items-center gap-4">
            <button @click="$emit('navigate', 'dashboard')" class="text-gray-600 hover:text-indigo-600 transition hidden sm:inline">
              Dashboard
            </button>
            <span class="text-gray-600 hidden sm:inline">{{ session?.name }}</span>
            <button @click="$emit('logout')" class="flex items-center gap-2 text-gray-600 hover:text-red-600 transition">
              <LogOut :size="20" />
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-4xl font-bold text-gray-800 mb-2">Ticket Management</h2>
          <p class="text-xl text-gray-600">Create, view, edit, and delete your tickets</p>
        </div>
        <button
          @click="showForm = !showForm"
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus :size="20" />
          New Ticket
        </button>
      </div>

      <div v-if="showForm" class="bg-white rounded-xl shadow-md p-8 mb-8">
        <h3 class="text-2xl font-bold mb-6">{{ editingTicket ? 'Edit Ticket' : 'Create New Ticket' }}</h3>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              v-model="formData.title"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Enter ticket title"
            />
            <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              v-model="formData.description"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Enter ticket description"
            />
            <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
              <select
                v-model="formData.status"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <p v-if="errors.status" class="text-red-500 text-sm mt-1">{{ errors.status }}</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select
                v-model="formData.priority"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div class="flex gap-4">
            <button type="submit" class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              {{ editingTicket ? 'Update Ticket' : 'Create Ticket' }}
            </button>
            <button type="button" @click="resetForm" class="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div v-if="tickets.length === 0" class="bg-white rounded-xl shadow-md p-12 text-center">
        <AlertCircle class="mx-auto text-gray-400 mb-4" :size="48" />
        <h3 class="text-2xl font-semibold text-gray-700 mb-2">No Tickets Yet</h3>
        <p class="text-gray-600 mb-6">Create your first ticket to get started.</p>
        <button
          @click="showForm = true"
          class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition inline-flex items-center gap-2"
        >
          <Plus :size="20" />
          Create Ticket
        </button>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="ticket in tickets"
          :key="ticket.id"
          class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-800 flex-1 pr-4">{{ ticket.title }}</h3>
            <span :class="[
              'px-3 py-1 rounded-full text-xs font-semibold border',
              getStatusColor(ticket.status)
            ]">
              {{ getStatusLabel(ticket.status) }}
            </span>
          </div>

          <p v-if="ticket.description" class="text-gray-600 mb-4 line-clamp-3">{{ ticket.description }}</p>

          <div class="flex items-center justify-between pt-4 border-t border-gray-200">
            <span class="text-sm text-gray-500">
              Priority: <span class="font-semibold capitalize">{{ ticket.priority || 'medium' }}</span>
            </span>
            <div class="flex gap-2">
              <button
                @click="handleEdit(ticket)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit"
              >
                <Edit2 :size="18" />
              </button>
              <button
                @click="deleteConfirm = ticket.id"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete"
              >
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="deleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle class="text-red-600" :size="24" />
          </div>
          <h3 class="text-2xl font-bold text-gray-800">Confirm Delete</h3>
        </div>
        <p class="text-gray-600 mb-8">Are you sure you want to delete this ticket? This action cannot be undone.</p>
        <div class="flex gap-4">
          <button
            @click="handleDelete(deleteConfirm)"
            class="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            @click="deleteConfirm = null"
            class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <footer class="bg-gray-800 text-white py-8 mt-20">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-400">&copy; 2025 Ticketlify. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { AlertCircle, Plus, Edit2, Trash2, XCircle, LogOut } from 'lucide-vue-next'

export default {
  name: 'TicketManagement',
  components: {
    AlertCircle,
    Plus,
    Edit2,
    Trash2,
    XCircle,
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
  emits: ['add-ticket', 'update-ticket', 'delete-ticket', 'navigate', 'logout'],
  setup(props, { emit }) {
    const showForm = ref(false)
    const editingTicket = ref(null)
    const deleteConfirm = ref(null)
    const formData = reactive({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium'
    })
    const errors = ref({})

    const resetForm = () => {
      formData.title = ''
      formData.description = ''
      formData.status = 'open'
      formData.priority = 'medium'
      errors.value = {}
      showForm.value = false
      editingTicket.value = null
    }

    const validate = () => {
      const newErrors = {}
      if (!formData.title.trim()) newErrors.title = 'Title is required'
      if (!formData.status) newErrors.status = 'Status is required'
      if (!['open', 'in_progress', 'closed'].includes(formData.status)) {
        newErrors.status = 'Status must be one of: open, in_progress, closed'
      }
      if (formData.description && formData.description.length > 500) {
        newErrors.description = 'Description must be less than 500 characters'
      }
      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
      if (validate()) {
        if (editingTicket.value) {
          emit('update-ticket', editingTicket.value.id, formData)
        } else {
          emit('add-ticket', formData)
        }
        resetForm()
      }
    }

    const handleEdit = (ticket) => {
      editingTicket.value = ticket
      formData.title = ticket.title
      formData.description = ticket.description || ''
      formData.status = ticket.status
      formData.priority = ticket.priority || 'medium'
      showForm.value = true
    }

    const handleDelete = (id) => {
      emit('delete-ticket', id)
      deleteConfirm.value = null
    }

    const getStatusColor = (status) => {
      switch (status) {
        case 'open': return 'bg-green-100 text-green-800 border-green-300'
        case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-300'
        case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300'
        default: return 'bg-gray-100 text-gray-800 border-gray-300'
      }
    }

    const getStatusLabel = (status) => {
      switch (status) {
        case 'open': return 'Open'
        case 'in_progress': return 'In Progress'
        case 'closed': return 'Closed'
        default: return status
      }
    }

    return {
      showForm,
      editingTicket,
      deleteConfirm,
      formData,
      errors,
      resetForm,
      handleSubmit,
      handleEdit,
      handleDelete,
      getStatusColor,
      getStatusLabel
    }
  }
}
</script>