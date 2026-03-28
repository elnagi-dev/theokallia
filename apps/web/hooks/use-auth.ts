import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { AuthUser } from '@theokallia/types'

// --- Types ---

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface VerifyOtpData {
  email: string
  otp: string
}

interface LoginData {
  email: string
  password: string
}

interface ForgotPasswordInput {
  email: string
}

// --- Hooks ---

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterData) =>
      api.post<{ message: string }>('/auth/register', data),
  })
}

export function useVerifyOtp() {
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: VerifyOtpData) =>
      api.post<{ message: string; user: AuthUser }>('/auth/verify-otp', data),
    onSuccess: (res) => {
      setUser(res.data.user)
    },
  })
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      api.post<{ message: string }>('/auth/resend-otp', data),
  })
}

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: LoginData) =>
      api.post<{ message: string; user: AuthUser }>('/auth/login', data),
    onSuccess: (res) => {
      setUser(res.data.user)
    },
  })
}

export function useLogout() {
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: () => api.post<{ message: string }>('/auth/logout'),
    onSuccess: () => {
      setUser(null)
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const res = await api.post('/auth/forgot-password', data)
      return res.data
    },
  })
}

export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const res = await api.post('/auth/verify-reset-otp', data)
      return res.data
    },
  })
}

export function useResendResetOtp() {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await api.post('/auth/forgot-password', data)
      return res.data
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post('/auth/reset-password', data)
      return res.data
    },
  })
}