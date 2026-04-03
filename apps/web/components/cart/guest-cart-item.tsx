'use client'

import Image from 'next/image'
import { Button } from '../ui/button'
import type { GuestCartItemType } from '@/lib/cart-storage'

interface GuestCartItemProps {
  item: GuestCartItemType
  onUpdate: (quantity: number) => void
  onRemove: () => void
}

export default function GuestCartItem({
  item,
  onUpdate,
  onRemove,
}: GuestCartItemProps) {
  return (
    <div className="flex max-w-xl gap-6 bg-neutral-50 p-4">
      <div className="relative h-44 w-44 shrink-0">
        <Image
          src={item.image || '/placeholder-image.jpg'}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between py-2">
        {/* name + price */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xl font-medium">{item.name}</p>
            <p className="text-lg text-gray-600">
              {item.subcategoryName ?? item.categoryName}
            </p>
          </div>
          <p className="font-allure text-lg font-semibold text-gray-900">
            ₦{(item.price * item.quantity).toLocaleString()}
          </p>
        </div>

        {/* wishlist button — to be wired when wishlist module is built */}

        {/* quantity stepper + remove */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                item.quantity > 1 ? onUpdate(item.quantity - 1) : onRemove()
              }
              className="flex h-7 w-7 items-center justify-center border border-gray-300 text-lg leading-none transition-colors hover:border-black"
            >
              −
            </button>
            <span className="min-w-6 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => onUpdate(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="flex h-7 w-7 items-center justify-center border border-gray-300 text-lg leading-none transition-colors hover:border-black disabled:opacity-40 disabled:border-gray-300"
            >
              +
            </button>
          </div>

          <Button
            variant="outline"
            onClick={onRemove}
            className="border border-black px-4 py-2 text-sm transition-colors hover:bg-black hover:text-white"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
