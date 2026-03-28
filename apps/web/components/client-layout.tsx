'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'
import AuthModal from '@/components/auth/auth-modal'
import AuthProvider from '@/lib/providers/auth-provider'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalView, setModalView] = useState<'login' | 'sign-up'>('login')
  const { setRedirectTo } = useAuthStore()
  const pathname = usePathname()

  const openLogin = () => {
    setRedirectTo(pathname)
    setModalView('login')
    setIsModalOpen(true)
  }

  const openSignUp = () => {
    setModalView('sign-up')
    setIsModalOpen(true)
  }

  return (
    <AuthProvider>
      <Navbar onOpenLogin={openLogin} onOpenSignUp={openSignUp} />
      <main className="flex-1">{children}</main>
      <BackToTop />
      <Footer />
      <AuthModal
        isOpen={isModalOpen}
        initialView={modalView}
        onClose={() => setIsModalOpen(false)}
      />
    </AuthProvider>
  )
}
