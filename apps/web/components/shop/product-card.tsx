import { Heart } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  category: string
  price: string
  badge: string | null
  slug: string
}

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex flex-col gap-2 font-cormorant-garamond">
      {/* Image */}
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.badge && (
            <span className="absolute z-10 bg-primary px-6 py-1.5 text-sm text-white">
              {product.badge}
            </span>
          )}
          <button className="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-white p-1.5 shadow">
            <Heart size={14} className="text-black" />
          </button>

          <div className="relative h-full w-full bg-amber-800/20">
            <Image
              src="/images/bracelet-2.webp"
              alt="Product"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex items-center justify-between text-lg text-gray-900 mt-2">
          <span className="text-xl">{product.name}</span>
          <span className="font-le-jour">{product.price}</span>
        </div>
        <p className="text-xl font-bold text-gray-900">{product.category}</p>
      </Link>

      {/* Button */}
      <Button
        variant="outline"
        className="w-full py-5 text-base font-bold tracking-wide transition-colors hover:border-none hover:bg-primary hover:text-white"
      >
        Add To Bag
      </Button>
    </div>
  )
}

export default ProductCard
