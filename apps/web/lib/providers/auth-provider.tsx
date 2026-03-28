'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import api from '@/lib/api'
import type { AuthUser } from '@theokallia/types'

const REDIRECT_IF_AUTHED = ['/']

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const initialPathname = useRef(pathname) // capture once — avoids stale closure issues

  // Runs once on mount — checks if user has a valid session
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true)
      try {
        const { data } = await api.get<AuthUser>('/users/me')
        setUser(data)

        if (REDIRECT_IF_AUTHED.includes(initialPathname.current)) {
          router.replace('/shop')
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    void checkSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-validates when user switches back to this tab
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState !== 'visible') return

      try {
        const { data } = await api.get<AuthUser>('/users/me')
        setUser(data)
      } catch {
        const hadUser = useAuthStore.getState().user !== null
        setUser(null)
        if (hadUser) router.replace('/')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [router, setUser])

  return <>{children}</>
}