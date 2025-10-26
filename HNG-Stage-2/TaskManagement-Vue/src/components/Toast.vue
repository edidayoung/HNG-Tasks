<template>
  <div
    :class="[
      'fixed top-4 right-4 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in max-w-md',
      bgColor
    ]"
  >
    <CheckCircle v-if="type === 'success'" :size="20" />
    <AlertCircle v-else :size="20" />
    <span class="flex-1">{{ message }}</span>
    <button @click="$emit('close')" class="hover:opacity-80">
      <X :size="18" />
    </button>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { CheckCircle, AlertCircle, X } from 'lucide-vue-next'

export default {
  name: 'Toast',
  components: {
    CheckCircle,
    AlertCircle,
    X
  },
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['error', 'success', 'info'].includes(value)
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const bgColor = computed(() => {
      switch (props.type) {
        case 'error': return 'bg-red-500'
        case 'success': return 'bg-green-500'
        default: return 'bg-blue-500'
      }
    })

    onMounted(() => {
      const timer = setTimeout(() => {
        emit('close')
      }, 4000)
      return () => clearTimeout(timer)
    })

    return {
      bgColor
    }
  }
}
</script>