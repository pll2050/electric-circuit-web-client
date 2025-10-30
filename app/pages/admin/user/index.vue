<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">User Management</h1>
        <p class="page-subtitle">Manage all registered users</p>
      </div>
      <Button
        icon="pi pi-refresh"
        label="Refresh"
        @click="handleRefresh"
        :loading="pending"
        severity="secondary"
      />
    </div>

    <!-- Error State -->
    <Message v-if="error" severity="error" :closable="false">
      Failed to load users: {{ error }}
      <template #icon>
        <i class="pi pi-times-circle"></i>
      </template>
      <Button
        label="Retry"
        @click="handleRefresh"
        severity="danger"
        size="small"
        class="ml-3"
      />
    </Message>

    <!-- Success State - DataTable -->
    <div v-else class="table-card">
      <div class="user-stats mb-4">
        <Card class="stat-card">
          <template #content>
            <div class="stat-label">Total Users</div>
            <div class="stat-value">{{ data.length }}</div>
          </template>
        </Card>
      </div>

      <DataTable
        :value="data"
        :loading="pending"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
        stripedRows
        showGridlines
      >
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-users" style="font-size: 3rem"></i>
            <p class="empty-title">No users found</p>
            <p class="empty-subtitle">There are no registered users yet.</p>
          </div>
        </template>

        <template #loading>
          <div class="loading-container">
            <ProgressSpinner />
            <p>Loading users...</p>
          </div>
        </template>

        <Column header="Avatar" style="width: 80px">
          <template #body="slotProps">
            <Avatar
              v-if="slotProps.data.photoURL"
              :image="slotProps.data.photoURL"
              shape="circle"
              size="large"
            />
            <Avatar
              v-else
              :label="getInitials(slotProps.data.displayName || slotProps.data.email)"
              shape="circle"
              size="large"
              style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white"
            />
          </template>
        </Column>

        <Column field="displayName" header="Name" sortable>
          <template #body="slotProps">
            <div class="user-name-cell">
              <div class="name-primary">{{ slotProps.data.displayName || 'N/A' }}</div>
              <div class="uid-secondary">{{ slotProps.data.uid }}</div>
            </div>
          </template>
        </Column>

        <Column field="email" header="Email" sortable></Column>

        <Column field="provider" header="Provider" sortable style="width: 120px">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.provider || 'email'"
              :severity="slotProps.data.provider === 'google' ? 'warn' : 'info'"
            />
          </template>
        </Column>

        <Column field="createdAt" header="Created At" sortable style="width: 180px">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdAt) }}
          </template>
        </Column>

        <Column field="lastLoginAt" header="Last Login" sortable style="width: 180px">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.lastLoginAt) }}
          </template>
        </Column>

        <Column header="Actions" style="width: 150px">
          <template #body="slotProps">
            <div class="actions-cell">
              <Button
                icon="pi pi-eye"
                rounded
                text
                severity="info"
                @click="viewUser(slotProps.data)"
                v-tooltip.top="'View Details'"
              />
              <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="warning"
                @click="editUser(slotProps.data)"
                v-tooltip.top="'Edit User'"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminUsers, type AdminUser } from '~/composables/admin/useAdminUsers'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'

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

// 이름 이니셜 추출
const getInitials = (name: string): string => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// 날짜 포맷팅
const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A'

  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return 'Invalid Date'

    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d)
  } catch (e) {
    return 'N/A'
  }
}

// 유저 상세보기
const viewUser = (user: AdminUser) => {
  console.log('View user:', user)
  // TODO: 유저 상세 페이지로 이동 또는 모달 표시
  alert(`View user: ${user.displayName || user.email}`)
}

// 유저 수정
const editUser = (user: AdminUser) => {
  console.log('Edit user:', user)
  // TODO: 유저 수정 페이지로 이동 또는 모달 표시
  alert(`Edit user: ${user.displayName || user.email}`)
}

// 컴포넌트 마운트 시 유저 목록 로드
onMounted(() => {
  loadUsers()
})

definePageMeta({
  layout: 'admin',
  title: '사용자 관리 - Electric Circuit Web'
})
</script>

<style scoped>
.user-page {
  padding: 1.5rem;
  padding-left: 1rem;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #718096;
  margin: 0;
}

/* User Stats */
.user-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-width: 200px;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
}

/* Table */
.table-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* User Name Cell */
.user-name-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.name-primary {
  font-weight: 600;
  color: #2d3748;
}

.uid-secondary {
  font-size: 0.75rem;
  color: #a0aec0;
  font-family: monospace;
}

/* Actions */
.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 1rem 0 0.5rem;
}

.empty-subtitle {
  color: #a0aec0;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #718096;
}
</style>
