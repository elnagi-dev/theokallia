'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import SignUpForm from '@/components/auth/sign-up-form'
import LoginForm from '@/components/auth/login-form'
import OtpForm from '@/components/auth/otp-form'
import EmailVerified from '@/components/auth/email-verified'

type AuthView = 'login' | 'sign-up' | 'otp' | 'verified'

interface AuthModalProps {
  isOpen: boolean
  initialView: 'login' | 'sign-up'
  onClose: () => void
}

export default function AuthModal({ isOpen, initialView, onClose }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView)
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    setView(initialView)
  }, [initialView])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    } else {
      setView(initialView)
      setEmail('')
    }
  }

  const handleSwitchToOtp = (userEmail: string) => {
    setEmail(userEmail)
    setView('otp')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-sm rounded-none border border-gray-200 p-8 shadow-lg">
        <DialogTitle className="sr-only">
          {view === 'sign-up' && 'Sign Up'}
          {view === 'login' && 'Login'}
          {view === 'otp' && 'Verify Email'}
          {view === 'verified' && 'Email Verified'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {view === 'sign-up' && 'Create your account to get started'}
          {view === 'login' && 'Sign in to your existing account'}
          {view === 'otp' && 'Enter the verification code sent to your email'}
          {view === 'verified' && 'Your email has been successfully verified'}
        </DialogDescription>

        {view === 'sign-up' && (
          <SignUpForm
            onSwitchToLogin={() => setView('login')}
            onSwitchToOtp={handleSwitchToOtp}
          />
        )}

        {view === 'login' && (
          <LoginForm
            onSwitchToSignUp={() => setView('sign-up')}
            onSuccess={onClose}
          />
        )}

        {view === 'otp' && (
          <OtpForm
            email={email}
            onVerified={() => setView('verified')}
            onBack={() => setView('sign-up')}
          />
        )}

        {view === 'verified' && (
          <EmailVerified onContinue={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}