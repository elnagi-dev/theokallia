'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Heart, ShoppingBag, User } from 'lucide-react'
import ProfileModal from '@/components/auth/profile-modal'

const links = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

interface NavbarProps {
  onOpenLogin: () => void
  onOpenSignUp: () => void
  isLoggedIn: boolean
}

const Navbar = ({ onOpenLogin, onOpenSignUp, isLoggedIn }: NavbarProps) => {
  const pathname = usePathname()

  return (
    <nav className="relative container mx-auto flex items-center justify-between px-20 py-4">
      <Link href="/">
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
      </Link>

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
          {isLoggedIn ? (
            <ProfileModal
              trigger={
                <User
                  size={20}
                  strokeWidth={1.5}
                  className="cursor-pointer text-foreground"
                />
              }
            />
          ) : (
            <>
              <Button variant="outline" onClick={onOpenLogin}>
                Log In
              </Button>
              <Button onClick={onOpenSignUp}>Sign Up</Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-foreground">
          <Heart size={20} strokeWidth={1.5} />
          <Link
            href="/cart"
            className={
              pathname === '/cart' ? 'text-secondary' : 'text-foreground'
            }
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar