import { Heart } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/hooks/use-products'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex flex-col gap-2 font-cormorant-garamond">
      {/* Image */}
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <button className="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-white p-1.5 shadow">
            <Heart size={14} className="text-black" />
          </button>
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          )}
        </div>

        {/* Info */}
        <div className="mt-2 flex items-center justify-between text-lg text-gray-900">
          <span className="text-xl">{product.name}</span>
          <span className="font-le-jour">
            ₦{product.price.toLocaleString()}
          </span>
        </div>
        <p className="text-xl font-bold text-gray-900">
          {product.category.name}
        </p>
      </Link>

      {/* Button */}
      <Button
        variant="outline"
        className="w-full py-5 text-base font-bold tracking-wide transition-colors hover:border-none hover:bg-[#7E22CE] hover:text-white"
      >
        Add To Bag
      </Button>
    </div>
  )
}

export default ProductCard
