'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Heart, ShoppingBag } from 'lucide-react'

const links = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="relative container mx-auto flex items-center justify-between px-20 py-4">
      <div className="relative h-[50px] w-[200px] cursor-pointer">
        <Image
          src="/logo.webp"
          alt="Theokallia Logo"
          fill
          sizes="200px"
          className="object-contain"
          priority
        />
      </div>

      <div className="flex items-center justify-between gap-8 text-lg">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'text-lg transition-colors hover:text-primary',
              pathname === link.href ? 'text-secondary' : 'text-foreground'
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <Button variant="outline">Log In</Button>
          <Button>Sign Up</Button>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <Heart size={20} strokeWidth={1.5} />
          <ShoppingBag size={20} strokeWidth={1.5} />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
