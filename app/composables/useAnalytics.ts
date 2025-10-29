import { logEvent, setUserId, setUserProperties } from 'firebase/analytics'

/**
 * Firebase Analytics를 사용하기 위한 Composable
 */
export const useAnalytics = () => {
  const { $firebaseAnalytics } = useNuxtApp()

  /**
   * 커스텀 이벤트 로깅
   */
  const trackEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
    if (!$firebaseAnalytics) {
      console.warn('Firebase Analytics is not initialized')
      return
    }

    try {
      logEvent($firebaseAnalytics, eventName, eventParams)
      console.log(`Analytics event tracked: ${eventName}`, eventParams)
    } catch (error) {
      console.error('Error tracking event:', error)
    }
  }

  /**
   * 페이지 뷰 추적
   */
  const trackPageView = (pageName: string, pageLocation?: string) => {
    trackEvent('page_view', {
      page_title: pageName,
      page_location: pageLocation || window.location.href,
    })
  }

  /**
   * 사용자 ID 설정
   */
  const setAnalyticsUserId = (userId: string) => {
    if (!$firebaseAnalytics) {
      console.warn('Firebase Analytics is not initialized')
      return
    }

    try {
      setUserId($firebaseAnalytics, userId)
      console.log(`Analytics user ID set: ${userId}`)
    } catch (error) {
      console.error('Error setting user ID:', error)
    }
  }

  /**
   * 사용자 속성 설정
   */
  const setAnalyticsUserProperties = (properties: { [key: string]: any }) => {
    if (!$firebaseAnalytics) {
      console.warn('Firebase Analytics is not initialized')
      return
    }

    try {
      setUserProperties($firebaseAnalytics, properties)
      console.log('Analytics user properties set:', properties)
    } catch (error) {
      console.error('Error setting user properties:', error)
    }
  }

  /**
   * 회로 관련 이벤트 추적
   */
  const trackCircuitEvent = (action: string, circuitData?: { [key: string]: any }) => {
    trackEvent('circuit_action', {
      action,
      ...circuitData,
    })
  }

  /**
   * 프로젝트 관련 이벤트 추적
   */
  const trackProjectEvent = (action: string, projectData?: { [key: string]: any }) => {
    trackEvent('project_action', {
      action,
      ...projectData,
    })
  }

  /**
   * 인증 관련 이벤트 추적
   */
  const trackAuthEvent = (action: 'login' | 'signup' | 'logout', method?: string) => {
    trackEvent(action, {
      method: method || 'email',
    })
  }

  return {
    trackEvent,
    trackPageView,
    setAnalyticsUserId,
    setAnalyticsUserProperties,
    trackCircuitEvent,
    trackProjectEvent,
    trackAuthEvent,
  }
}
