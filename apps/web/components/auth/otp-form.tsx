'use client'

import { useEffect, useRef, useState } from 'react'
import { useVerifyOtp, useResendOtp } from '@/lib/hooks/use-auth'

interface OtpFormProps {
  email: string
  onVerified: () => void
  onBack: () => void
  onTerms: () => void
  onPrivacy: () => void
}

export default function OtpForm({
  email,
  onVerified,
  onBack,
  onTerms,
  onPrivacy,
}: OtpFormProps) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { mutate: verifyOtp, isPending } = useVerifyOtp()
  const { mutate: resendOtp, isPending: isResending } = useResendOtp()

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true)
      return
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handleResend = () => {
    resendOtp(
      { email },
      {
        onSuccess: () => {
          setOtp(['', '', '', ''])
          setTimer(30)
          setCanResend(false)
          setError(null)
          inputRefs.current[0]?.focus()
        },
        onError: (err) => {
          setError(err.message)
        },
      }
    )
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError(null)

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== '')) {
      const otpString = newOtp.join('')
      setTimeout(() => {
        verifyOtp(
          { email, otp: otpString },
          {
            onSuccess: () => onVerified(),
            onError: (err) => {
              setError(err.message)
              setOtp(['', '', '', ''])
              inputRefs.current[0]?.focus()
            },
          }
        )
      }, 300)
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const formattedTime = `0:${timer.toString().padStart(2, '0')}`

  return (
    <div className="flex flex-col items-center px-2">
      <h2
        className="mb-8 text-center text-xl leading-snug font-normal"
        style={{ fontFamily: 'var(--font-cormorant-garamond)' }}
      >
        Enter the code we just sent
        <br />
        to your Email
      </h2>

      <div className="mb-6 flex gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={isPending}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-16 w-14 border border-gray-300 text-center text-xl outline-none focus:border-purple-700 focus:ring-1 focus:ring-purple-700 disabled:opacity-50"
            style={{ fontFamily: 'var(--font-cormorant-garamond)' }}
          />
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {canResend ? (
        <p className="mb-6 text-sm text-gray-500">
          Didn&apos;t receive an email?{' '}
          <button
            onClick={handleResend}
            disabled={isResending}
            className="cursor-pointer text-purple-700 underline disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend OTP'}
          </button>
        </p>
      ) : (
        <p
          className="mb-6 text-sm text-gray-600"
          style={{ fontFamily: 'var(--font-cormorant-garamond)' }}
        >
          {formattedTime}
        </p>
      )}

      <button
        onClick={onBack}
        disabled={isPending}
        className="w-full border border-gray-300 py-3.5 text-sm tracking-wide text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
        style={{ fontFamily: 'var(--font-cormorant-garamond)' }}
      >
        Back to Sign Up
      </button>

      <div className="mt-8 flex justify-center gap-3 text-xs text-gray-400">
        <span onClick={onTerms} className="cursor-pointer hover:text-gray-600">
          Terms of service
        </span>
        <span>|</span>
        <span
          onClick={onPrivacy}
          className="cursor-pointer hover:text-gray-600"
        >
          Privacy policy
        </span>
      </div>
    </div>
  )
}
