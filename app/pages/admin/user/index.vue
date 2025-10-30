<template>
  <div class="user-page">
    <h1 class="text-2xl font-bold mb-4">User Management</h1>

    <!-- Error State -->
    <div v-if="error" class="error-message">
      <p>Failed to load users: {{ error }}</p>
      <button @click="handleRefresh" class="retry-button">Retry</button>
    </div>

    <!-- Loading State -->
    <div v-else-if="pending" class="loading-message">
      <p>Loading users...</p>
    </div>

    <!-- Success State -->
    <div v-else-if="data && data.length > 0">
      <ul class="user-list">
        <li v-for="user in data" :key="user.uid" class="user-item">
          <p><strong>Name:</strong> {{ user.displayName || 'N/A' }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>UID:</strong> {{ user.uid }}</p>
        </li>
      </ul>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-message">
      <p>No users found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminUsers, type AdminUser } from '~/composables/admin/useAdminUsers'

const { fetchUsers } = useAdminUsers()

const data = ref<AdminUser[]>([])
const pending = ref(true)
const error = ref<string | null>(null)

// 유저 목록 로드
const loadUsers = async () => {
  pending.value = true
  error.value = null

  try {
    data.value = await fetchUsers()
  } catch (err: any) {
    error.value = err.message || 'Failed to load users'
    console.error('Failed to fetch users:', err)
  } finally {
    pending.value = false
  }
}

// Refresh 핸들러
const handleRefresh = () => {
  loadUsers()
}

// 컴포넌트 마운트 시 유저 목록 로드
onMounted(() => {
  loadUsers()
})

definePageMeta({
  layout: 'admin'
})
</script>

<style scoped>
.user-page {
  padding: 1rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: bold;
}

.mb-4 {
  margin-bottom: 1rem;
}

.user-list {
  list-style: none;
  padding: 0;
}

.user-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.user-item p {
  margin: 0.25rem 0;
}

.error-message {
  padding: 1rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
}

.error-message p {
  margin-bottom: 0.5rem;
}

.retry-button {
  padding: 0.5rem 1rem;
  background-color: #c33;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.retry-button:hover {
  background-color: #a22;
}

.loading-message {
  padding: 1rem;
  background-color: #e8f4f8;
  border: 1px solid #b3d9e6;
  border-radius: 4px;
  color: #0c5460;
}

.empty-message {
  padding: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  color: #856404;
}
</style>