import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth'

/**
 * Firebase Authentication을 위한 Composable
 */
export const useFirebaseAuth = () => {
  const { $firebaseAuth } = useNuxtApp()

  /**
   * 회원가입
   */
  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<UserCredential> => {
    try {
      // Firebase에 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(
        $firebaseAuth,
        email,
        password
      )

      // 사용자 프로필 업데이트 (이름 설정)
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        })
      }

      return userCredential
    } catch (error: any) {
      console.error('Firebase 회원가입 오류:', error)
      throw new Error(getFirebaseErrorMessage(error.code))
    }
  }

  /**
   * 로그인
   */
  const login = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        $firebaseAuth,
        email,
        password
      )
      return userCredential
    } catch (error: any) {
      console.error('Firebase 로그인 오류:', error)
      throw new Error(getFirebaseErrorMessage(error.code))
    }
  }

  /**
   * Google 로그인
   */
  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      const userCredential = await signInWithPopup($firebaseAuth, provider)
      return userCredential
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // 팝업을 닫은 경우 콘솔에만 남김
        console.warn('Google 로그인 창이 닫혔습니다.')
        return Promise.reject(error)
      }
      console.error('Google 로그인 오류:', error)
      throw new Error(getFirebaseErrorMessage(error.code))
    }
  }

  /**
   * 로그아웃
   */
  const logout = async (): Promise<void> => {
    try {
      await signOut($firebaseAuth)
    } catch (error: any) {
      console.error('Firebase 로그아웃 오류:', error)
      throw new Error('로그아웃에 실패했습니다.')
    }
  }

  /**
   * 현재 사용자의 ID 토큰 가져오기
   */
  const getIdToken = async (user: User): Promise<string> => {
    try {
      const token = await user.getIdToken()
      return token
    } catch (error: any) {
      console.error('토큰 가져오기 오류:', error)
      throw new Error('토큰을 가져오는데 실패했습니다.')
    }
  }

  /**
   * Firebase 에러 코드를 사용자 친화적인 메시지로 변환
   */
  const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return '이미 사용 중인 이메일입니다.'
      case 'auth/invalid-email':
        return '유효하지 않은 이메일 형식입니다.'
      case 'auth/operation-not-allowed':
        return '이메일/비밀번호 로그인이 비활성화되어 있습니다.'
      case 'auth/weak-password':
        return '비밀번호가 너무 약합니다. 최소 6자 이상 입력해주세요.'
      case 'auth/user-disabled':
        return '비활성화된 계정입니다.'
      case 'auth/user-not-found':
        return '이메일 또는 비밀번호가 올바르지 않습니다.'
      case 'auth/wrong-password':
        return '이메일 또는 비밀번호가 올바르지 않습니다.'
      case 'auth/too-many-requests':
        return '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
      case 'auth/network-request-failed':
        return '네트워크 연결을 확인해주세요.'
      default:
        return '인증 중 오류가 발생했습니다.'
    }
  }

  return {
    register,
    login,
    signInWithGoogle,
    logout,
    getIdToken,
    getFirebaseErrorMessage,
  }
}
