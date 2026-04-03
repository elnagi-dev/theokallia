'use client'

import Image from 'next/image'
import { Button } from '../ui/button'
import { useRemoveCartItem } from '@/lib/hooks/use-cart'

interface CartItemProps {
  item: {
    id: string
    productId: string
    quantity: number
    product: {
      id: string
      name: string
      slug: string
      price: number
      images: string[]
      inStock: boolean
      stock: number
      category: { name: string }
      subcategory: { name: string } | null
    }
  }
  onUpdate: (quantity: number) => void
}

export default function CartItem({ item, onUpdate }: CartItemProps) {
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem()

  return (
    <div className="flex max-w-xl gap-6 bg-neutral-50 p-4">
      <div className="relative h-44 w-44 shrink-0">
        <Image
          src={item.product.images[0] || '/placeholder-image.jpg'}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between py-2">
        {/* name + price */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xl font-medium">{item.product.name}</p>
            <p className="text-lg text-gray-600">
              {item.product.subcategory?.name ?? item.product.category.name}
            </p>
          </div>
          <p className="font-allure text-lg font-semibold text-gray-900">
            ₦{(item.product.price * item.quantity).toLocaleString()}
          </p>
        </div>

        {/* wishlist button — to be wired when wishlist module is built */}

        {/* quantity stepper + remove */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                // decrement to 0 removes the item entirely
                item.quantity > 1 ? onUpdate(item.quantity - 1) : removeItem(item.id)
              }
              disabled={isRemoving}
              className="flex h-7 w-7 items-center justify-center border border-gray-300 text-lg leading-none transition-colors hover:border-black disabled:opacity-40"
            >
              −
            </button>
            <span className="min-w-6 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => onUpdate(item.quantity + 1)}
              // disable + when removing or when quantity has reached available stock
              disabled={isRemoving || item.quantity >= item.product.stock}
              className="flex h-7 w-7 items-center justify-center border border-gray-300 text-lg leading-none transition-colors hover:border-black disabled:opacity-40 disabled:border-gray-300"
            >
              +
            </button>
          </div>

          <Button
            variant="outline"
            onClick={() => removeItem(item.id)}
            disabled={isRemoving}
            className="border border-black px-4 py-2 text-sm transition-colors hover:bg-black hover:text-white disabled:opacity-40"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}