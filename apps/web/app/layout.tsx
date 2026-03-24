import type { Metadata } from 'next'
import './globals.css'
import { Cormorant_Garamond } from 'next/font/google'
import localFont from 'next/font/local'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'

const fontSans = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontSerif = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
})

const fontMono = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-mono',
})

const leJour = localFont({
  src: '../public/fonts/Le Jour Serif Personal Use Only.otf',
  variable: '--font-le-jour',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Theokallia',
  description: 'Timeless Elegance Crafted for You',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} ${leJour.variable} flex min-h-full flex-col antialiased`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <BackToTop />
        <Footer />
      </body>
    </html>
  )
}
