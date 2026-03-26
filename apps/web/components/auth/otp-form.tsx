'use client'

import { useEffect, useRef, useState } from 'react'

interface OtpFormProps {
  onVerified: () => void
  onBack: () => void
  flow: 'login' | 'sign-up'
}

export default function OtpForm({ onVerified, onBack, flow }: OtpFormProps) {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // countdown timer
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
    setOtp(['', '', '', ''])
    setTimer(30)
    setCanResend(false)
    inputRefs.current[0]?.focus()
  }

  const handleChange = (index: number, value: string) => {
    // only allow single digit
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // take last character in case of paste
    setOtp(newOtp)

    // auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // auto-advance when all 4 filled
    if (newOtp.every((digit) => digit !== '')) {
      setTimeout(() => onVerified(), 300)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const formattedTime = `0:${timer.toString().padStart(2, '0')}`

  return (
    <div className="flex flex-col items-center px-2">
      <h2
        className="mb-8 text-center text-xl font-normal leading-snug"
        style={{ fontFamily: 'var(--font-cormorant-garamond)' }}
      >
        Enter the code we just sent
        <br />
        to your Email
      </h2>

      {/* OTP boxes */}
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
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-16 w-14 border border-gray-300 text-center text-xl outline-none focus:border-purple-700 focus:ring-1 focus:ring-purple-700"
            style={{ fontFamily: 'var(--font-cormorant-garamond)' }}
          />
        ))}
      </div>

      {/* timer or resend */}
      {canResend ? (
        <p className="mb-6 text-sm text-gray-500">
          Didn&apos;t receive an email?{' '}
          <button
            onClick={handleResend}
            className="cursor-pointer text-purple-700 underline"
          >
            Resend OTP
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

      {/* back button */}
      <button
        onClick={onBack}
        className="w-full border border-gray-300 py-3.5 text-sm tracking-wide text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
        style={{ fontFamily: 'var(--font-cormorant-garamond)' }}
      >
        {flow === 'login' ? 'Back to Sign In' : 'Back to Sign Up'}
      </button>

      <div className="mt-8 flex justify-center gap-3 text-xs text-gray-400">
        <span className="cursor-pointer hover:text-gray-600">Terms of service</span>
        <span>|</span>
        <span className="cursor-pointer hover:text-gray-600">Privacy policy</span>
      </div>
    </div>
  )
}