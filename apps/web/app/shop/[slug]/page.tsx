'use client'

import ProductImages from '@/components/product/product-images'
import ProductInfo from '@/components/product/product-info'
import ProductShipping from '@/components/product/product-shipping'
import ProductRatingSummary from '@/components/product/product-rating-summary'
import ProductReviews from '@/components/product/product-reviews'
import SimilarProducts from '@/components/product/similar-products'
import { useProduct } from '@/lib/hooks/use-products'
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data: product, isLoading, isError } = useProduct(slug)

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <p className="font-cormorant-garamond text-xl text-gray-400">
            Loading...
          </p>
        </div>
      </main>
    )
  }

  if (isError || !product) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <p className="font-cormorant-garamond text-xl text-gray-400">
            Product not found.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Top Section — Image + Info */}
      <div className="grid grid-cols-2 gap-12">
        <ProductImages images={product.images} productName={product.name} />

        <div className="flex flex-col gap-6">
          <ProductInfo
            name={product.name}
            category={product.category.name}
            price={`₦${product.price.toLocaleString()}`}
            description={product.description}
          />
          <ProductShipping
            shipping={{
              deliveryTime: '3-5 working days',
              courier: 'DHL',
              arrival: '26th - 31st March',
              location: 'Nigeria',
            }}
          />
        </div>
      </div>

      {/* Ratings + Reviews */}
      <div className="mt-16 flex flex-col gap-8">
        <ProductRatingSummary
          rating={product.rating}
          reviewCount={product.reviewCount}
          breakdown={product.ratingBreakdown}
        />
        <ProductReviews
          reviews={product.reviews.map((review) => ({
            id: parseInt(review.id),
            name: `${review.user.firstName} ${review.user.lastName}`,
            date: new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',refactor: pass slug as prop to SimilarProducts instead of useParams
              month: 'long',
              day: 'numeric',
            }),
            rating: review.rating,
            comment: review.comment,
          }))}
        />
      </div>

      {/* Similar Products */}
      <div className="mt-16">
        <SimilarProducts slug={slug} />
      </div>
    </main>
  )
}