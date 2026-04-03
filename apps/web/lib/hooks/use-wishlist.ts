import api from '@/lib/api'
import {
  clearGuestWishlist,
  getGuestWishlist,
  isInGuestWishlist,
  toggleGuestWishlist,
} from '@/lib/wishlist-storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// types

interface WishlistProduct {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  inStock: boolean
  category: { name: string }
}

interface WishlistItem {
  id: string
  wishlistId: string
  productId: string
  createdAt: string
  product: WishlistProduct
}

interface Wishlist {
  id: string
  userId: string
  items: WishlistItem[]
  createdAt: string
  updatedAt: string
}

// response from POST /wishlist/toggle
interface ToggleWishlistResponse {
  wishlisted: boolean  // true = just added, false = just removed
  wishlist: Wishlist
}

// fetchers

const fetchWishlist = async (): Promise<Wishlist> => {
  const res = await api.get('/wishlist')
  return res.data
}

const toggleWishlistItem = async (productId: string): Promise<ToggleWishlistResponse> => {
  const res = await api.post('/wishlist/toggle', { productId })
  return res.data
}

const removeWishlistItem = async (itemId: string): Promise<Wishlist> => {
  const res = await api.delete(`/wishlist/${itemId}`)
  return res.data
}

const mergeWishlist = async (productIds: string[]): Promise<Wishlist> => {
  const res = await api.post('/wishlist/merge', { productIds })
  return res.data
}

// hooks

/**
 * Fetches the current user's wishlist.
 * staleTime is 0 — wishlist must always be fresh so heart icons reflect real state.
 * Only runs when the user is authenticated (enabled prop controls this).
 */
export const useWishlist = (enabled = true) => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    staleTime: 0,
    enabled,
  })
}

/**
 * Toggles a product in the wishlist — adds if not present, removes if already there.
 * Guest → writes to localStorage. Authenticated → calls API with optimistic update.
 * Returns wishlisted boolean so the heart icon updates immediately.
 */
export const useToggleWishlist = (isAuthenticated: boolean) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => {
      if (!isAuthenticated) {
        // guest — write to localStorage, return synthetic response
        const wishlisted = toggleGuestWishlist(productId)
        return Promise.resolve({ wishlisted, wishlist: null as unknown as Wishlist })
      }
      return toggleWishlistItem(productId)
    },
    onMutate: async (productId: string) => {
      if (!isAuthenticated) return

      // cancel any outgoing refetches to avoid overwriting the optimistic update
      await queryClient.cancelQueries({ queryKey: ['wishlist'] })

      // snapshot current wishlist for rollback on error
      const previous = queryClient.getQueryData<Wishlist>(['wishlist'])

      // optimistic update — toggle the item in cache immediately
      queryClient.setQueryData<Wishlist>(['wishlist'], (old) => {
        if (!old) return old
        const exists = old.items.some((i) => i.productId === productId)
        return {
          ...old,
          items: exists
            ? old.items.filter((i) => i.productId !== productId)
            : [
                ...old.items,
                // minimal shape — server will return the real item on settle
                {
                  id: `optimistic-${productId}`,
                  wishlistId: old.id,
                  productId,
                  createdAt: new Date().toISOString(),
                  product: old.items[0]?.product ?? ({} as WishlistProduct),
                },
              ],
        }
      })

      return { previous }
    },
    onError: (_err, _productId, context) => {
      // rollback to the snapshot if the API call fails
      if (context?.previous) {
        queryClient.setQueryData(['wishlist'], context.previous)
      }
    },
    onSettled: () => {
      if (isAuthenticated) {
        // replace optimistic data with server truth
        queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      }
    },
  })
}

/**
 * Merges the guest's localStorage wishlist into their DB wishlist after login.
 * Called once immediately after a successful login if localStorage has items.
 * After this resolves, the frontend clears localStorage.
 */
export const useMergeWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productIds: string[]) => mergeWishlist(productIds),
    onSuccess: () => {
      clearGuestWishlist()
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
}

/**
 * Removes a specific wishlist item by its WishlistItem ID.
 * Use this when you have a direct itemId — prefer useToggleWishlist for heart icon interactions.
 */
export const useRemoveWishlistItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => removeWishlistItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
}

/**
 * Checks if a product is wishlisted.
 * For authenticated users — checks the React Query cache.
 * For guests — checks localStorage directly.
 * Use this for the heart icon filled/empty state.
 */
export const useIsWishlisted = (productId: string, isAuthenticated: boolean): boolean => {
  const { data: wishlist } = useWishlist(isAuthenticated)

  if (!isAuthenticated) {
    return isInGuestWishlist(productId)
  }

  return wishlist?.items.some((i) => i.productId === productId) ?? false
}