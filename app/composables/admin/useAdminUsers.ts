/**
 * 관리자용 유저 관리 Composable
 */
import { useApi } from '~/composables/useApi'

export interface AdminUser {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  emailVerified?: boolean
  disabled?: boolean
  createdAt?: string
  lastLoginAt?: string
  role?: string
}

export interface CreateUserData {
  email: string
  password: string
  displayName?: string
  role?: string
}

export interface UpdateUserData {
  displayName?: string
  email?: string
  photoURL?: string
  disabled?: boolean
  role?: string
}

export const useAdminUsers = () => {
  const api = useApi()

  /**
   * 모든 유저 목록 가져오기
   */
  const fetchUsers = async (): Promise<AdminUser[]> => {
    const response = await api.get<{ success: boolean; users: AdminUser[] }>('/api/users')
    return response.users
  }

  /**
   * 특정 유저 정보 가져오기
   */
  const fetchUser = async (uid: string): Promise<AdminUser> => {
    return api.get<AdminUser>(`/api/users/${uid}`)
  }

  /**
   * 새 유저 생성
   */
  const createUser = async (data: CreateUserData): Promise<AdminUser> => {
    return api.post<AdminUser>('/api/users', data)
  }

  /**
   * 유저 정보 업데이트
   */
  const updateUser = async (uid: string, data: UpdateUserData): Promise<AdminUser> => {
    return api.put<AdminUser>(`/api/users/${uid}`, data)
  }

  /**
   * 유저 삭제
   */
  const deleteUser = async (uid: string): Promise<void> => {
    return api.delete<void>(`/api/users/${uid}`)
  }

  /**
   * 유저 활성화/비활성화
   */
  const toggleUserStatus = async (uid: string, disabled: boolean): Promise<AdminUser> => {
    return api.patch<AdminUser>(`/api/users/${uid}/status`, { disabled })
  }

  /**
   * 유저 역할 변경
   */
  const updateUserRole = async (uid: string, role: string): Promise<AdminUser> => {
    return api.patch<AdminUser>(`/api/users/${uid}/role`, { role })
  }

  /**
   * 유저 검색
   */
  const searchUsers = async (query: string): Promise<AdminUser[]> => {
    return api.get<AdminUser[]>(`/api/users/search?q=${encodeURIComponent(query)}`)
  }

  return {
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    updateUserRole,
    searchUsers,
  }
}
