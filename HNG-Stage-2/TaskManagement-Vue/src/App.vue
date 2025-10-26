<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Toast
      v-if="toast"
      :message="toast.message"
      :type="toast.type"
      @close="hideToast"
    />
    
    <LandingPage
      v-if="currentPage === 'landing'"
      @navigate="navigateTo"
    />
    <LoginPage
      v-else-if="currentPage === 'login'"
      @login="login"
      @navigate="navigateTo"
    />
    <SignupPage
      v-else-if="currentPage === 'signup'"
      @signup="signup"
      @navigate="navigateTo"
    />
    <Dashboard
      v-else-if="currentPage === 'dashboard'"
      :tickets="tickets"
      :session="session"
      @navigate="navigateTo"
      @logout="logout"
    />
    <TicketManagement
      v-else-if="currentPage === 'tickets'"
      :tickets="tickets"
      :session="session"
      @add-ticket="addTicket"
      @update-ticket="updateTicket"
      @delete-ticket="deleteTicket"
      @navigate="navigateTo"
      @logout="logout"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Toast from './components/Toast.vue'
import LandingPage from './components/LandingPage.vue'
import LoginPage from './components/LoginPage.vue'
import SignupPage from './components/SignupPage.vue'
import Dashboard from './components/Dashboard.vue'
import TicketManagement from './components/TicketManagement.vue'

// Utility functions
const generateId = () => '_' + Math.random().toString(36).substr(2, 9)

const getStoredData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const setStoredData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export default {
  name: 'App',
  components: {
    Toast,
    LandingPage,
    LoginPage,
    SignupPage,
    Dashboard,
    TicketManagement
  },
  setup() {
    const currentPage = ref('landing')
    const session = ref(null)
    const toast = ref(null)
    const tickets = ref([])
    const users = ref([])

    onMounted(() => {
      const storedSession = getStoredData('ticketapp_session')
      const storedTickets = getStoredData('ticketapp_tickets', [])
      const storedUsers = getStoredData('ticketapp_users', [
        { id: '1', email: 'demo@example.com', password: 'demo123', name: 'Demo User' }
      ])

      session.value = storedSession
      tickets.value = storedTickets
      users.value = storedUsers

      if (storedSession) {
        currentPage.value = 'dashboard'
      }
    })

    const showToast = (message, type = 'info') => {
      toast.value = { message, type }
    }

    const hideToast = () => {
      toast.value = null
    }

    const login = (email, password) => {
      const user = users.value.find(u => u.email === email && u.password === password)
      if (user) {
        const sessionData = { userId: user.id, email: user.email, name: user.name, token: generateId() }
        setStoredData('ticketapp_session', sessionData)
        session.value = sessionData
        currentPage.value = 'dashboard'
        showToast('Login successful! Welcome back.', 'success')
        return true
      }
      showToast('Invalid email or password. Please try again.', 'error')
      return false
    }

    const signup = (email, password, name) => {
      if (users.value.find(u => u.email === email)) {
        showToast('Email already exists. Please use a different email.', 'error')
        return false
      }
      const newUser = { id: generateId(), email, password, name }
      const updatedUsers = [...users.value, newUser]
      users.value = updatedUsers
      setStoredData('ticketapp_users', updatedUsers)
      
      const sessionData = { userId: newUser.id, email: newUser.email, name: newUser.name, token: generateId() }
      setStoredData('ticketapp_session', sessionData)
      session.value = sessionData
      currentPage.value = 'dashboard'
      showToast('Account created successfully! Welcome aboard.', 'success')
      return true
    }

    const logout = () => {
      localStorage.removeItem('ticketapp_session')
      session.value = null
      currentPage.value = 'landing'
      showToast('You have been logged out successfully.', 'success')
    }

    const addTicket = (ticket) => {
      const newTicket = { ...ticket, id: generateId(), createdAt: new Date().toISOString() }
      const updatedTickets = [...tickets.value, newTicket]
      tickets.value = updatedTickets
      setStoredData('ticketapp_tickets', updatedTickets)
      showToast('Ticket created successfully!', 'success')
    }

    const updateTicket = (id, updatedData) => {
      const updatedTickets = tickets.value.map(t => 
        t.id === id ? { ...t, ...updatedData, updatedAt: new Date().toISOString() } : t
      )
      tickets.value = updatedTickets
      setStoredData('ticketapp_tickets', updatedTickets)
      showToast('Ticket updated successfully!', 'success')
    }

    const deleteTicket = (id) => {
      const updatedTickets = tickets.value.filter(t => t.id !== id)
      tickets.value = updatedTickets
      setStoredData('ticketapp_tickets', updatedTickets)
      showToast('Ticket deleted successfully!', 'success')
    }

    const navigateTo = (page) => {
      if ((page === 'dashboard' || page === 'tickets') && !session.value) {
        currentPage.value = 'login'
        showToast('Your session has expired — please log in again.', 'error')
        return
      }
      currentPage.value = page
    }

    return {
      currentPage,
      session,
      toast,
      tickets,
      users,
      showToast,
      hideToast,
      login,
      signup,
      logout,
      addTicket,
      updateTicket,
      deleteTicket,
      navigateTo
    }
  }
}
</script>

<style>
@import './style.css';
</style>