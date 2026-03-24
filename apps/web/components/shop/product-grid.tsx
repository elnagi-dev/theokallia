import React from 'react'
import ProductCard from './product-card'

const products = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  category: 'Gold Bracelet',
  name: 'Temi',
  price: '₦5000',
  badge: i % 2 === 0 ? 'Best seller' : null,
}))

const ProductGrid = () => {
  return (
    <div className="flex flex-1 flex-col gap-10">
      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <button className="text-sm font-light tracking-wide underline underline-offset-4">
          Load More
        </button>
      </div>
    </div>
  )
}

export default ProductGrid
