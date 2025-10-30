/**
 * API 통신을 위한 Composable
 */

export const useApi = () => {
  const config = useRuntimeConfig()

  // API 기본 URL (환경변수에서 가져오거나 기본값 사용)
  const baseURL = config.public.apiBaseUrl || 'http://localhost:8080/api'

  /**
   * API 요청 함수
   */
  const request = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = `${baseURL}${endpoint}`

    // 기본 헤더 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    // 토큰이 있으면 Authorization 헤더 추가
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // 응답이 JSON이 아닐 수 있으므로 체크
      const contentType = response.headers.get('content-type')
      const isJson = contentType?.includes('application/json')

      if (!response.ok) {
        const error = isJson ? await response.json() : { message: response.statusText }
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }

      return isJson ? await response.json() : (await response.text() as any)
    } catch (error: any) {
      console.error('API 요청 실패:', error)
      throw error
    }
  }

  /**
   * GET 요청
   */
  const get = <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST 요청
   */
  const post = <T = any>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT 요청
   */
  const put = <T = any>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH 요청
   */
  const patch = <T = any>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE 요청
   */
  const del = <T = any>(endpoint: string, options?: RequestInit): Promise<T> => {
    return request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  }
}
