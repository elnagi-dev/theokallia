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
import ForgotPasswordForm from '@/components/auth/forgot-password-form'
import ResetOtpForm from '@/components/auth/reset-otp-form'
import ResetPasswordForm from '@/components/auth/reset-password-form'
import PasswordResetSuccess from '@/components/auth/password-reset-success'
import TermsOfService from '@/components/auth/terms-of-service'
import PrivacyPolicy from '@/components/auth/privacy-policy'

type AuthView =
  | 'login'
  | 'sign-up'
  | 'otp'
  | 'verified'
  | 'forgot-password'
  | 'reset-otp'
  | 'reset-password'
  | 'password-reset-success'
  | 'terms'
  | 'privacy'

interface AuthModalProps {
  isOpen: boolean
  initialView: 'login' | 'sign-up'
  onClose: () => void
}

export default function AuthModal({ isOpen, initialView, onClose }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView)
  const [previousView, setPreviousView] = useState<AuthView>(initialView)
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    setView(initialView)
    setPreviousView(initialView)
  }, [initialView])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    } else {
      setView(initialView)
      setPreviousView(initialView)
      setEmail('')
    }
  }

  const openTerms = () => {
    setPreviousView(view)
    setView('terms')
  }

  const openPrivacy = () => {
    setPreviousView(view)
    setView('privacy')
  }

  const goBack = () => setView(previousView)

  // shared footer props passed to every form
  const legalProps = { onTerms: openTerms, onPrivacy: openPrivacy }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-sm rounded-none border border-gray-200 p-8 shadow-lg">
        <DialogTitle className="sr-only">
          {view === 'sign-up' && 'Sign Up'}
          {view === 'login' && 'Login'}
          {view === 'otp' && 'Verify Email'}
          {view === 'verified' && 'Email Verified'}
          {view === 'forgot-password' && 'Forgot Password'}
          {view === 'reset-otp' && 'Enter Reset Code'}
          {view === 'reset-password' && 'Create New Password'}
          {view === 'password-reset-success' && 'Password Reset Successful'}
          {view === 'terms' && 'Terms of Service'}
          {view === 'privacy' && 'Privacy Policy'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {view === 'sign-up' && 'Create your account to get started'}
          {view === 'login' && 'Sign in to your existing account'}
          {view === 'otp' && 'Enter the verification code sent to your email'}
          {view === 'verified' && 'Your email has been successfully verified'}
          {view === 'forgot-password' && 'Enter your email to receive a password reset code'}
          {view === 'reset-otp' && 'Enter the reset code sent to your email'}
          {view === 'reset-password' && 'Create your new password'}
          {view === 'password-reset-success' && 'Your password has been reset successfully'}
          {view === 'terms' && 'Terms of service for Theokallia'}
          {view === 'privacy' && 'Privacy policy for Theokallia'}
        </DialogDescription>

        {view === 'sign-up' && (
          <SignUpForm
            onSwitchToLogin={() => setView('login')}
            onSwitchToOtp={(userEmail) => { setEmail(userEmail); setView('otp') }}
            {...legalProps}
          />
        )}

        {view === 'login' && (
          <LoginForm
            onSwitchToSignUp={() => setView('sign-up')}
            onSuccess={onClose}
            onForgotPassword={() => setView('forgot-password')}
            {...legalProps}
          />
        )}

        {view === 'otp' && (
          <OtpForm
            email={email}
            onVerified={() => setView('verified')}
            onBack={() => setView('sign-up')}
            {...legalProps}
          />
        )}

        {view === 'verified' && (
          <EmailVerified onContinue={onClose} />
        )}

        {view === 'forgot-password' && (
          <ForgotPasswordForm
            onEmailSent={(userEmail) => { setEmail(userEmail); setView('reset-otp') }}
            onBack={() => setView('login')}
            {...legalProps}
          />
        )}

        {view === 'reset-otp' && (
          <ResetOtpForm
            email={email}
            onVerified={() => setView('reset-password')}
            onBack={() => setView('forgot-password')}
            {...legalProps}
          />
        )}

        {view === 'reset-password' && (
          <ResetPasswordForm
            email={email}
            onSuccess={() => setView('password-reset-success')}
            {...legalProps}
          />
        )}

        {view === 'password-reset-success' && (
          <PasswordResetSuccess onContinue={() => setView('login')} />
        )}

        {view === 'terms' && (
          <TermsOfService onContinue={goBack} />
        )}

        {view === 'privacy' && (
          <PrivacyPolicy onContinue={goBack} />
        )}
      </DialogContent>
    </Dialog>
  )
}