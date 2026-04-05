import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getGuestCart, clearGuestCart } from '@/lib/cart-storage'
import { getGuestWishlist, clearGuestWishlist } from '@/lib/wishlist-storage'
import type { AuthUser } from '@theokallia/types'
import { useGuestCartStore } from '../stores/guest-cart-store'
import { useGuestWishlistStore } from '../stores/guest-wishlist-store'

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

/**
 * Creates a new user account.
 * Does NOT log the user in — registration triggers OTP verification first.
 * On success, the caller should switch the auth modal to the OTP form.
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterData) =>
      api.post<{ message: string }>('/auth/register', data),
  })
}

/**
 * Verifies the OTP sent to the user's email after registration.
 * On success, the user is created in the DB, tokens are set as httpOnly cookies,
 * and the Zustand store is populated with the returned AuthUser.
 */
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

/**
 * Resends the OTP verification email.
 * Resets the TTL on both the OTP and pending-registration Redis keys.
 * Called from the OTP form when the user hasn't received their code.
 */
export function useResendOtp() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      api.post<{ message: string }>('/auth/resend-otp', data),
  })
}

/**
 * Logs the user in with email and password.
 * On success:
 * - Populates the Zustand store with the returned AuthUser
 * - If the guest had items in their localStorage cart, merges them into the DB cart
 *   then clears both localStorage and the Zustand guest cart store
 * - If the guest had a wishlist in localStorage, merges it into the DB wishlist
 * - Invalidates the ['cart'] and ['wishlist'] React Query caches so navbar and pages update immediately
 * Tokens are set as httpOnly cookies by NestJS — never handled here.
 */
export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser)
  const clearGuestCartStore = useGuestCartStore((state) => state.clear)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginData) =>
      api.post<{ message: string; user: AuthUser }>('/auth/login', data),
    onSuccess: async (res) => {
      // populate auth store first so subsequent API calls are authenticated
      setUser(res.data.user)

      // merge guest cart if localStorage has items
      const guestCartItems = getGuestCart()
      if (guestCartItems.length > 0) {
        try {
          // strip down to just productId + quantity — all NestJS needs for merge
          const itemsToMerge = guestCartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
          await api.post('/cart/merge', { items: itemsToMerge })
          // clear both localStorage and the in-memory Zustand store
          clearGuestCart()
          clearGuestCartStore()
          // invalidate cart cache so navbar badge and cart page reflect merged state
          queryClient.invalidateQueries({ queryKey: ['cart'] })
        } catch {
          // merge failure is non-fatal — guest items stay in localStorage and Zustand
          // they will be retried on next login
          console.error('[useLogin] Cart merge failed — localStorage cart preserved')
        }
      }

      // merge guest wishlist if localStorage has items
      const guestWishlistProducts = getGuestWishlist()
      if (guestWishlistProducts.length > 0) {
        try {
          await api.post('/wishlist/merge', {
            productIds: guestWishlistProducts.map((p) => p.id),
          })
          clearGuestWishlist()
          // clear the in-memory Zustand store
          useGuestWishlistStore.getState().clearItems()
          // invalidate wishlist cache so navbar badge and wishlist page reflect merged state
          queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        } catch {
          // merge failure is non-fatal — guest wishlist stays in localStorage
          console.error('[useLogin] Wishlist merge failed — localStorage wishlist preserved')
        }
      }
    },
  })
}

/**
 * Logs the user out.
 * Deletes the refresh token from the DB and clears httpOnly cookies on the server.
 * Clears the Zustand auth store so the UI reflects the logged-out state immediately.
 */
export function useLogout() {
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: () => api.post<{ message: string }>('/auth/logout'),
    onSuccess: () => {
      setUser(null)
    },
  })
}

/**
 * Sends a password reset OTP to the provided email.
 * The response is intentionally vague — "If that email exists, a reset code has been sent"
 * — to avoid revealing whether an account exists.
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const res = await api.post('/auth/forgot-password', data)
      return res.data
    },
  })
}

/**
 * Verifies the password reset OTP.
 * On success, a reset grant is stored in Redis (TTL 10min).
 * The caller should switch to the new password form.
 */
export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const res = await api.post('/auth/verify-reset-otp', data)
      return res.data
    },
  })
}

/**
 * Resends the password reset OTP.
 * Reuses the forgot-password endpoint which generates a new OTP and resets the Redis TTL.
 */
export function useResendResetOtp() {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await api.post('/auth/forgot-password', data)
      return res.data
    },
  })
}

/**
 * Resets the user's password after OTP verification.
 * Requires a valid reset grant in Redis — expires 10 minutes after verify-reset-otp.
 * On success, all existing refresh tokens are invalidated, forcing a fresh login.
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post('/auth/reset-password', data)
      return res.data
    },
  })
}