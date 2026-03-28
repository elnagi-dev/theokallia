'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, SquarePen } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import EditProfileForm from '@/components/auth/edit-profile-form'
import { useLogout } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import LogoutConfirmDialog from '@/components/auth/logout-confirm-dialog'

type OpenSection = 'address' | 'orders' | 'card' | null

interface ProfileModalProps {
  trigger: React.ReactNode
}

const mockUser = {
  name: 'Michael Okoro',
  email: '@michaelokoro@gmail.com',
  address: 'No 24 inyang edem street',
  card: {
    number: '1203 6609 2903 4470',
    holder: 'Michael Okoro',
    expiry: '2/20/2029',
    securityCode: '***',
  },
  lastOrder: {
    date: '12th jan 2025',
  },
}

export default function ProfileModal({ trigger }: ProfileModalProps) {
  const [openSection, setOpenSection] = useState<OpenSection>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isEditingOpen, setIsEditingOpen] = useState(false)

  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const { mutate: logout, isPending: isLoggingOut } = useLogout()
  const router = useRouter()

  const toggleSection = (section: OpenSection) => {
    setOpenSection((prev) => (prev === section ? null : section))
  }

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open)
    if (!open) setOpenSection(null)
  }

  const handleEditOpen = () => {
    setIsPopoverOpen(false) // close popover first
    setIsEditingOpen(true) // then open dialog
  }

  const handleLogoutConfirm = () => {
    logout(undefined, {
      onSuccess: () => {
        setIsLogoutOpen(false)
        setIsPopoverOpen(false)
        router.push('/')
      },
    })
  }

  return (
    <>
      {/* profile popover */}
      <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-80 rounded-none border border-gray-200 p-6 shadow-lg"
        >
          <div className="flex flex-col">
            {/* user info */}
            <div className="mb-5 text-center">
              <h2 className="font-cormorant-garamond text-2xl font-normal">
                {mockUser.name}
              </h2>
              <p className="mt-1 font-cormorant-garamond text-xs text-gray-500">
                {mockUser.email}
              </p>
            </div>

            {/* accordion sections */}
            <div className="flex flex-col gap-3">
              {/* address */}
              <div className="border border-gray-200">
                <button
                  onClick={() => toggleSection('address')}
                  className="flex w-full items-center justify-between px-4 py-2"
                >
                  <span className="font-cormorant-garamond text-lg font-normal">
                    Address
                  </span>
                  {openSection === 'address' ? (
                    <ChevronDown size={16} strokeWidth={1.5} />
                  ) : (
                    <ChevronRight size={16} strokeWidth={1.5} />
                  )}
                </button>
                {openSection === 'address' && (
                  <div className="px-4 pb-3 font-cormorant-garamond text-sm text-gray-600">
                    {mockUser.address ? (
                      <p>{mockUser.address}</p>
                    ) : (
                      <button className="border border-gray-300 px-4 py-1.5 text-sm hover:border-gray-400">
                        Add Address
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* order history */}
              <div className="border border-gray-200">
                <button
                  onClick={() => toggleSection('orders')}
                  className="flex w-full items-center justify-between px-4 py-2"
                >
                  <span className="font-cormorant-garamond text-lg font-normal">
                    Order history
                  </span>
                  {openSection === 'orders' ? (
                    <ChevronDown size={16} strokeWidth={1.5} />
                  ) : (
                    <ChevronRight size={16} strokeWidth={1.5} />
                  )}
                </button>
                {openSection === 'orders' && (
                  <div className="px-4 pb-3 font-cormorant-garamond text-sm">
                    {mockUser.lastOrder ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-400">Last order</p>
                        <div className="flex items-center gap-4">
                          <p className="text-gray-500">
                            🕐 {mockUser.lastOrder.date}
                          </p>
                          <button className="border border-gray-300 px-3 py-1 text-xs hover:border-gray-400">
                            View more
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400">No orders yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* card details */}
              <div className="border border-gray-200">
                <button
                  onClick={() => toggleSection('card')}
                  className="flex w-full items-center justify-between px-4 py-2"
                >
                  <span className="font-cormorant-garamond text-lg font-normal">
                    Card details
                  </span>
                  {openSection === 'card' ? (
                    <ChevronDown size={16} strokeWidth={1.5} />
                  ) : (
                    <ChevronRight size={16} strokeWidth={1.5} />
                  )}
                </button>
                {openSection === 'card' && (
                  <div className="px-4 pb-3 font-cormorant-garamond text-sm">
                    {mockUser.card ? (
                      <div className="flex flex-col gap-2 text-gray-600">
                        <div>
                          <p className="text-gray-700">Card number</p>
                          <p>{mockUser.card.number}</p>
                        </div>
                        <div>
                          <p className="text-gray-700">Card holder Name</p>
                          <p>{mockUser.card.holder}</p>
                        </div>
                        <div className="flex gap-8">
                          <div>
                            <p className="text-gray-700">Expiry Date</p>
                            <p>{mockUser.card.expiry}</p>
                          </div>
                          <div>
                            <p className="text-gray-700">Security code</p>
                            <p>{mockUser.card.securityCode}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button className="border border-gray-300 px-4 py-1.5 text-sm hover:border-gray-400">
                        Add Card
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* edit profile button */}
            <Button
              onClick={handleEditOpen}
              className="mt-5 w-full rounded-none bg-purple-700 py-5 text-sm tracking-wide text-white hover:bg-purple-800"
            >
              <SquarePen size={15} strokeWidth={1.5} />
              Edit profile
            </Button>

            <Button
              variant="link"
              onClick={() => {
                setIsPopoverOpen(false)
                setIsLogoutOpen(true)
              }}
              className="mt-2 text-base text-red-500"
            >
              Log Out
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* edit profile dialog */}
      <Dialog open={isEditingOpen} onOpenChange={setIsEditingOpen}>
        <DialogContent className="w-full max-w-sm rounded-none bg-white p-8 px-6 pb-4 shadow-md">
          <DialogTitle className="sr-only">Edit Profile</DialogTitle>
          <EditProfileForm onBack={() => setIsEditingOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* logout confirm dialog */}
      <LogoutConfirmDialog
        isOpen={isLogoutOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutOpen(false)}
        isPending={isLoggingOut}
      />
    </>
  )
}
