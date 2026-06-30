'use client'

import { useState } from 'react'
import { ViewTransition } from 'react'
import Image from 'next/image'

interface ProductImagesProps {
  images: string[]
  productName: string
  slug: string
}

const ProductImages = ({ images, productName, slug }: ProductImagesProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex flex-col gap-3">
       {/* Main Image */}
       <div className="relative aspect-square w-full overflow-hidden bg-[#f5f0eb]">
         {images[activeIndex] ? (
           <ViewTransition name={slug}>
             <Image
               src={images[activeIndex]}
               alt={productName}
               fill
               className="object-cover"
               sizes="(max-width: 768px) 100vw, 50vw"
               priority
             />
           </ViewTransition>
         ) : (
           <div className="flex h-full w-full items-center justify-center text-gray-400">
             No image available
           </div>
         )}
       </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => {
          const isActive = activeIndex === index

          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden bg-[#f5f0eb] transition-opacity ${
                isActive
                  ? 'opacity-100'
                  : 'opacity-80 hover:opacity-100'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12vw"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ProductImages
