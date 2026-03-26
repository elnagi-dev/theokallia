'use client'

import { useState } from 'react'
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
  onSuccess: () => void
}

export default function AuthModal({isOpen, initialView, onClose, onSuccess}: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView)
  const [flow, setFlow] = useState<'login' | 'sign-up'>(initialView)

  // sync view when modal is reopened with a different initialView
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    } else {
      setView(initialView)
      setFlow(initialView)
    }
  }

  const handleSwitchToOtp = (currentFlow: 'login' | 'sign-up') => {
    setFlow(currentFlow) // Tracks which flow initiated OTP
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
            onSwitchToOtp={() => handleSwitchToOtp('sign-up')}
          />
        )}

        {view === 'login' && (
          <LoginForm
            onSwitchToSignUp={() => setView('sign-up')}
            onSwitchToOtp={() => handleSwitchToOtp('login')}
          />
        )}

        {view === 'otp' && (
          <OtpForm
            flow={flow}
            onVerified={() => setView('verified')}
            onBack={() => setView(flow)}
          />
        )}

        {view === 'verified' && <EmailVerified onContinue={() => {
          onSuccess()
          onClose()
        }} />}
      </DialogContent>
    </Dialog>
  )
}
