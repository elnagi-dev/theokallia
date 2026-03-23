import type { Metadata } from 'next'
import './globals.css'
import { Cormorant_Garamond } from 'next/font/google'
import localFont from 'next/font/local'

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
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} ${leJour.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
