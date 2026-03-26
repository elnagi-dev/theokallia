'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductInfoProps {
  name: string
  category: string
  price: string
  description: string
}

const ProductInfo = ({
  name,
  category,
  price,
  description,
}: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1)

  const increment = () => setQuantity((prev) => prev + 1)
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="flex flex-col gap-6 font-cormorant-garamond">
      {/* Name + Price */}
      <div className="flex flex-col gap-1">
        <h3 className="text-3xl">{name}</h3>
        <h1 className="text-3xl font-semibold">{category}</h1>
        <p className="mt-4 font-le-jour text-3xl text-gray-900">
          {price.startsWith('₦') ? price : `₦${Number(price).toLocaleString()}`}
        </p>
      </div>

      {/* Description */}
      <div className="border border-gray-400 p-4">
        <h2 className="mb-2 text-base font-semibold text-gray-900">
          Description
        </h2>
        <p className="text-base leading-relaxed font-light text-gray-600">
          {description}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          className="flex h-8 w-8 items-center justify-center bg-primary text-white transition-opacity hover:opacity-80"
        >
          <Minus size={14} />
        </button>
        <span className="w-4 text-center font-le-jour text-base text-gray-900">
          {quantity}
        </span>
        <button
          onClick={increment}
          className="flex h-8 w-8 items-center justify-center bg-primary text-white transition-opacity hover:opacity-80"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 py-5 text-base font-semibold tracking-wide hover:border-none hover:bg-primary hover:text-white"
        >
          Add to Cart
        </Button>
        <Button className="flex-1 bg-primary py-5 text-base font-semibold tracking-wide text-white hover:opacity-90">
          Buy Now
        </Button>
      </div>
    </div>
  )
}

export default ProductInfo
