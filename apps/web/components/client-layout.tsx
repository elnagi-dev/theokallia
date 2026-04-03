'use client'

import { useEffect } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'
import AuthModal from '@/components/auth/auth-modal'
import AuthProvider from '@/lib/providers/auth-provider'
import { Toaster } from '@/components/ui/sonner'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useGuestCartStore } from '@/lib/stores/guest-cart-store'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const {
    authModalOpen,
    authModalView,
    openAuthModal,
    closeAuthModal,
    setRedirectTo,
  } = useAuthStore()
  const pathname = usePathname()

  // hydrate the guest cart store from localStorage on app load
  // must run client-side only — localStorage is not available on the server
  const hydrate = useGuestCartStore((state) => state.hydrate)

  useEffect(() => {
    // runs once on mount — populates in-memory guest cart from persisted localStorage data
    void hydrate()
  }, [hydrate])

  const openLogin = () => {
    setRedirectTo(pathname)
    openAuthModal('login')
  }

  const openSignUp = () => {
    openAuthModal('sign-up')
  }

  return (
    <AuthProvider>
      <Navbar onOpenLogin={openLogin} onOpenSignUp={openSignUp} />
      <main className="flex-1">{children}</main>
      <BackToTop />
      <Footer />
      <AuthModal
        isOpen={authModalOpen}
        initialView={authModalView}
        onClose={closeAuthModal}
      />
      <Toaster />
    </AuthProvider>
  )
}
