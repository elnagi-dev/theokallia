'use client'
import { ChevronUp } from 'lucide-react'
import useBackToTop from '@/hooks/use-back-to-top'

const BackToTop = () => {
  const { visible, scrollToTop } = useBackToTop()

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 bg-primary/90 hover:bg-primary/70 text-white p-3 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ChevronUp size={20} />
    </button>
  )
}

export default BackToTop