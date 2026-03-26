import { Heart } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

interface Product {
  id: number
  name: string
  category: string
  price: string
  badge: string | null
}

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex flex-col gap-2 font-cormorant-garamond">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.badge && (
          <span className="absolute z-10 bg-primary px-6 py-1.5 text-sm text-white">
            {product.badge}
          </span>
        )}
        <button className="absolute top-2 right-2 z-10 rounded-full bg-white p-1.5 shadow cursor-pointer">
          <Heart size={14} className="text-black" />
        </button>

        <div className="h-full w-full bg-amber-800/20" />
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-lg text-gray-900">
        <span>{product.name}</span>
        <span className="font-le-jour">{product.price}</span>
      </div>
      <p className="text-xl font-bold text-gray-900">{product.category}</p>

      {/* Button */}
      <Button
        variant="outline"
        className="w-full py-5 text-base font-bold tracking-wide transition-colors hover:bg-primary hover:text-white hover:border-none"
      >
        Add To Bag
      </Button>
    </div>
  )
}

export default ProductCard
