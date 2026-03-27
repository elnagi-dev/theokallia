export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  comment: string
  user: {
    name: string
  }
  createdAt: string
}