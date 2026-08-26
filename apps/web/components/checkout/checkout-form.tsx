'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useInitializePayment, useVerifyPayment } from '@/lib/hooks/use-payments'
import { useCreateOrder } from '@/lib/hooks/use-orders'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Dynamically import the hook-related logic or the library if it's causing issues.
// However, react-paystack is a hook. Hooks must be used inside components.
// The issue is the library itself likely accesses `window` at the top level.


const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  street: z.string().min(5, 'Shipping address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

interface CheckoutFormProps {
  onPaymentInitiated: (details: CheckoutFormValues) => void
  isPending: boolean
}

export default function CheckoutForm({ onPaymentInitiated, isPending }: CheckoutFormProps) {
  const router = useRouter()
  const { mutateAsync: initializePayment, isPending: isInitializing } = useInitializePayment()
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder()
  const { mutateAsync: verifyPayment } = useVerifyPayment()
  const [isVerifying, setIsVerifying] = useState(false)

  // Prevent navigation during payment verification
  useEffect(() => {
    if (!isVerifying) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }

    const handlePopState = () => {
      // Push the current state back to prevent back/forward
      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)
    // Push initial state so popstate fires on first back attempt
    window.history.pushState(null, '', window.location.href)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isVerifying])

  const {

    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'Nigeria',
    },
  })

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      onPaymentInitiated(data)
      
      // 2. Create the order first
      const order = await createOrder({
        shippingAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
        },
      })
      
      // 3. Initialize payment using the created order's ID
      const paymentData = await initializePayment(order.id)
      
      // 4. Trigger Paystack popup
      // Since react-paystack has SSR issues, we use the native window call 
      // but wrapped in a check to ensure it only runs on the client.
      if (typeof window !== 'undefined') {
        if (!window.PaystackPop) {
          await new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = 'https://js.paystack.co/v1/inline.js'
            script.async = true
            script.onload = resolve
            document.head.appendChild(script)
          })
        }

        // Ensure the script has initialized the global object
        await new Promise((resolve) => setTimeout(resolve, 100))

        if (window.PaystackPop && typeof window.PaystackPop.setup === 'function') {
          const handler = window.PaystackPop.setup({
            key: paymentData.publicKey,
            email: paymentData.email,
            amount: paymentData.amount,
            currency: 'NGN',
            ref: paymentData.reference,
            callback: (response: { reference: string }) => {
              setIsVerifying(true)
              verifyPayment(response.reference).then(() => {
                toast.success('Payment successful! Redirecting...')
                router.push('/checkout/success')
              }).catch(() => {
                setIsVerifying(false)
                toast.error('Payment verification failed. Please contact support.')
                router.push('/checkout/cancel')
              })
            },
            onClose: () => {
              toast.error('Payment cancelled.')
              router.push('/checkout/cancel')
            },
          })
          handler.openIframe()
        } else {
          throw new Error('PaystackPop.setup is not available')
        }
      }
    } catch (unknownError) {
      const error = unknownError as { response?: { data?: { message?: string } } }
      toast.error(error?.response?.data?.message || 'Failed to complete purchase. Please try again.')
      console.error(unknownError)
      console.error(error)
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <h2 className="font-le-jour text-2xl tracking-wide uppercase">
        Shipping Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <input
            {...register('fullName')}
            placeholder="Full Name"
            disabled={isInitializing || isCreatingOrder}
            className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.fullName && <span className="text-xs text-red-500">{errors.fullName.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register('phone')}
            placeholder="Phone Number"
            disabled={isInitializing || isCreatingOrder}
            className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register('street')}
            placeholder="Street Address"
            disabled={isInitializing || isCreatingOrder}
            className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.street && <span className="text-xs text-red-500">{errors.street.message}</span>}
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <input
            {...register('city')}
            placeholder="City"
            disabled={isInitializing || isCreatingOrder}
            className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.city && <span className="text-xs text-red-500">{errors.city.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register('state')}
            placeholder="State"
            disabled={isInitializing || isCreatingOrder}
            className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.state && <span className="text-xs text-red-500">{errors.state.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register('country')}
            placeholder="Country"
            disabled={isInitializing || isCreatingOrder}
            className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.country && <span className="text-xs text-red-500">{errors.country.message}</span>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isInitializing || isCreatingOrder || isPending}
        className="w-full py-4 text-sm tracking-widest text-white uppercase transition-colors hover:bg-purple-700 disabled:opacity-50"
        style={{ background: 'var(--color-primary)' }}
      >
        {isInitializing || isCreatingOrder ? 'Processing...' : 'Complete Purchase'}
      </button>

      {isVerifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-4 rounded-lg bg-white px-12 py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
            <p className="font-allure text-xl text-gray-900">Processing your payment...</p>
            <p className="text-sm text-gray-500">Please do not close this page.</p>
          </div>
        </div>
      )}
    </form>
  )
}
