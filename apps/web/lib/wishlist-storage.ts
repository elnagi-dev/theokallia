// guest wishlist stored in localStorage under this key
const WISHLIST_KEY = 'theokallia_guest_wishlist'

const isBrowser = typeof window !== 'undefined'

/**
 * Reads the guest wishlist from localStorage.
 * Returns an empty array if nothing is stored or parsing fails.
 * Wishlist items are just productIds — no quantity needed.
 */
export const getGuestWishlist = (): string[] => {
  if (!isBrowser) return []
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

/**
 * Toggles a product in the guest wishlist.
 * Adds if not present, removes if already there.
 * Returns true if the product was added, false if it was removed.
 */
export const toggleGuestWishlist = (productId: string): boolean => {
  if (!isBrowser) return false
  const items = getGuestWishlist()
  const index = items.indexOf(productId)
  if (index === -1) {
    items.push(productId)
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
    return true // added
  } else {
    items.splice(index, 1)
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
    return false // removed
  }
}

/**
 * Checks if a product is in the guest wishlist.
 */
export const isInGuestWishlist = (productId: string): boolean => {
  if (!isBrowser) return false
  return getGuestWishlist().includes(productId)
}

/**
 * Clears the entire guest wishlist from localStorage.
 * Called after a successful merge into the DB wishlist on login.
 */
export const clearGuestWishlist = (): void => {
  if (!isBrowser) return
  localStorage.removeItem(WISHLIST_KEY)
}