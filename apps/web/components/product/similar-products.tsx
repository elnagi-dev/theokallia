import ProductCard from '@/components/shop/product-card'

const similarProducts = [
  {
    id: 101,
    name: 'Temi',
    category: 'Gold Bracelet',
    price: '₦5,000',
    badge: null,
    slug: 'temi-gold-bracelet-101',
  },
  {
    id: 102,
    name: 'Temi',
    category: 'Gold Bracelet',
    price: '₦5,000',
    badge: null,
    slug: 'temi-gold-bracelet-102',
  },
  {
    id: 103,
    name: 'Temi',
    category: 'Gold Bracelet',
    price: '₦5,000',
    badge: null,
    slug: 'temi-gold-bracelet-103',
  },
]

const SimilarProducts = () => {
  return (
    <div className="flex flex-col gap-6 font-cormorant-garamond">
      <h2 className="text-2xl font-semibold text-gray-900">Similar products</h2>

      <div className="grid grid-cols-3 gap-6">
        {similarProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default SimilarProducts
