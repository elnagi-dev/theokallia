'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'
import AuthModal from '@/components/auth/auth-modal'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalView, setModalView] = useState<'login' | 'sign-up'>('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const openLogin = () => {
    setModalView('login')
    setIsModalOpen(true)
  }

  const openSignUp = () => {
    setModalView('sign-up')
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <Navbar onOpenLogin={openLogin} onOpenSignUp={openSignUp} isLoggedIn={isLoggedIn} />
      <main className="flex-1">{children}</main>
      <BackToTop />
      <Footer />
      <AuthModal
        isOpen={isModalOpen}
        initialView={modalView}
        onClose={closeModal}
        onSuccess={() => setIsLoggedIn(true)}
      />
    </>
  )
}