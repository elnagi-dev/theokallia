import React from 'react'
import { Shield, Package, Truck, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const cartItems = [
  {
    id: 1,
    name: 'Temi',
    description: 'Gold Bracelet',
    price: 5000,
    image: '/images/bracelet-2.webp',
  },
  {
    id: 2,
    name: 'Temi',
    description: 'Gold Bracelet',
    price: 5000,
    image: '/images/bracelet-2.webp',
  },
  {
    id: 3,
    name: 'Temi',
    description: 'Gold Bracelet',
    price: 5000,
    image: '/images/bracelet-2.webp',
  },
]

const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
const deliveryFee = 10000

const page = () => {
  return (
    <div className="min-h-screen w-full bg-white px-20 pt-10">
      {/* Header */}
      <div className="mb-12 flex items-baseline gap-4">
        <h1 className="font-le-jour text-6xl tracking-wide uppercase">
          Shopping Bag
        </h1>
        <span className="font-le-jour text-lg tracking-widest uppercase">
          ({cartItems.length} Items)
        </span>
      </div>

      <div className="flex items-center">
        {/* Cart Items */}
        <div className="flex flex-1 flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex max-w-xl gap-6 bg-neutral-50 p-4"
            >
              <div className="relative h-44 w-44 shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between py-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xl font-medium">{item.name}</p>
                    <p className="text-lg text-gray-600">{item.description}</p>
                  </div>
                  <p className="font-allure text-lg font-semibold text-gray-900">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>

                <button className="cursor-pointer text-base font-semibold underline text-start w-max">
                  Move to wishlist
                </button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border border-black px-4 py-2 text-sm transition-colors hover:bg-black hover:text-white"
                  >
                    Remove from Cart
                  </Button>
                  <Button className="px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700">
                    Buy Item
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-md shrink-0">
          <div className="flex flex-col gap-6 border border-gray-200 p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-le-jour text-2xl tracking-wide uppercase">
                Subtotal
              </h2>
              <span className="text-2xl font-medium">
                ₦{subtotal.toLocaleString()}.00
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Delivery fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <Shield size={16} />
                <span>Secured payment</span>
              </div>
              <div className="flex items-center gap-3">
                <Package size={16} />
                <span>Free Packaging</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={16} />
                <span>Fast delivery (3-5 days)</span>
              </div>
            </div>
            <button className="w-full bg-purple-600 py-3 text-sm tracking-widest text-white uppercase transition-colors hover:bg-purple-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Back to shop */}
      <div className="mt-16 mb-10">
        <button className="flex items-center gap-1 font-le-jour text-base tracking-widest uppercase">
          <ChevronLeft size={24} />
          Back to Shop
        </button>
      </div>
    </div>
  )
}

export default page
