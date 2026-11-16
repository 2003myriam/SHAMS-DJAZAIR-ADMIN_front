// Store Zustand de l'authentification : utilisateur connecté et jeton d'accès (cookie).
import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'access_token'

export const useAuthStore = create()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  // l'utilisateur (email + rôle) est gardé dans le localStorage
  // pour ne pas perdre le rôle (et donc les permissions) quand on recharge la page
  let initUser = null
  try {
    initUser = JSON.parse(localStorage.getItem('user')) || null
  } catch {
    initUser = null
  }
  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          localStorage.setItem('user', JSON.stringify(user))
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          localStorage.removeItem('user')
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
