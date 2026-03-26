import ProductImages from '@/components/product/product-images'
import ProductInfo from '@/components/product/product-info'
import ProductShipping from '@/components/product/product-shipping'
import ProductRatingSummary from '@/components/product/product-rating-summary'
import ProductReviews from '@/components/product/product-reviews'
import SimilarProducts from '@/components/product/similar-products'

const mockProduct = {
  id: 1,
  slug: 'temi-gold-bracelets',
  name: 'Temi',
  category: 'Gold Bracelets',
  price: '₦5,000',
  description:
    'A bracelet is a piece of jewelry worn around the wrist, typically made from materials like metal, beads, leather, or gemstones. It\'s often used to add style or a personal touch to an outfit.',
  images: [
    '/images/bracelet-2.webp',
    '/images/earring-2.webp',
    '/images/necklace-2.webp',
    '/images/necklace-3.webp',
  ],
  rating: 4.8,
  reviewCount: 4,
  ratingBreakdown: { 5: 3, 4: 1, 3: 0, 2: 0, 1: 0 },
  shipping: {
    deliveryTime: '3-5 working days',
    courier: 'DHL',
    arrival: '26th - 31st March',
    location: 'Nigeria',
  },
  reviews: [
    {
      id: 1,
      name: 'Racheal',
      date: '26th March 2026',
      rating: 4,
      comment:
        'Absolutely love this bracelet. The quality feels great and it looks even better in person. It\'s simple but elegant, and goes with almost anything. Definitely worth it.',
    },
    {
      id: 2,
      name: 'Racheal',
      date: '26th March 2026',
      rating: 4,
      comment:
        'Absolutely love this bracelet. The quality feels great and it looks even better in person. It\'s simple but elegant, and goes with almost anything. Definitely worth it.',
    },
    {
      id: 3,
      name: 'Racheal',
      date: '26th March 2026',
      rating: 4,
      comment:
        'Absolutely love this bracelet. The quality feels great and it looks even better in person. It\'s simple but elegant, and goes with almost anything. Definitely worth it.',
    },
    {
      id: 4,
      name: 'Racheal',
      date: '26th March 2026',
      rating: 4,
      comment:
        'Absolutely love this bracelet. The quality feels great and it looks even better in person. It\'s simple but elegant, and goes with almost anything. Definitely worth it.',
    },
  ],
}

export default function ProductPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Top Section — Image + Info */}
      <div className="grid grid-cols-2 gap-12">
        <ProductImages images={mockProduct.images} productName={mockProduct.name} />

        <div className="flex flex-col gap-6">
          <ProductInfo
            name={mockProduct.name}
            category={mockProduct.category}
            price={mockProduct.price}
            description={mockProduct.description}
          />
          <ProductShipping shipping={mockProduct.shipping} />
        </div>
      </div>

      {/* Ratings + Reviews */}
      <div className="mt-16 flex flex-col gap-8">
        <ProductRatingSummary
          rating={mockProduct.rating}
          reviewCount={mockProduct.reviewCount}
          breakdown={mockProduct.ratingBreakdown}
        />
        <ProductReviews reviews={mockProduct.reviews} />
      </div>

      {/* Similar Products */}
      <div className="mt-16">
        <SimilarProducts />
      </div>
    </main>
  )
}