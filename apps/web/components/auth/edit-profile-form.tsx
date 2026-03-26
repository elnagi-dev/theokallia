import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface EditProfileFormProps {
  onBack: () => void
}

export default function EditProfileForm({ onBack }: EditProfileFormProps) {
  return (
    <div className="scrollbar-hide flex max-h-[600px] flex-col overflow-y-auto">
      <h2 className="mb-8 text-center font-le-jour text-2xl font-normal">
        EDIT PROFILE
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-normal text-gray-700">
            First Name
          </Label>
          <Input className="rounded-none border-gray-300" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-normal text-gray-700">Last Name</Label>
          <Input className="rounded-none border-gray-300" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-normal text-gray-700">Email</Label>
          <Input type="email" className="rounded-none border-gray-300" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-normal text-gray-700">
            Card Number
          </Label>
          <Input className="rounded-none border-gray-300" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-normal text-gray-700">
            Card Holder Name
          </Label>
          <Input className="rounded-none border-gray-300" />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label className="text-sm font-normal text-gray-700">
              Expiry date
            </Label>
            <Input
              className="rounded-none border-gray-300"
              placeholder="MM/YY"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Label className="text-sm font-normal text-gray-700">
              Security code
            </Label>
            <Input className="rounded-none border-gray-300" placeholder="***" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-normal text-gray-700">Address</Label>
          <Textarea
            id="address"
            rows={4}
            className="w-full resize-none border-gray-300 px-3 py-2 text-sm outline-none focus:border-purple-700 focus:ring-1 focus:ring-purple-700"
            style={{ fontFamily: 'var(--font-cormorant-garamond)' }}
            placeholder="Enter your address"
          />
        </div>
      </div>

      <div className="sticky bottom-0 mt-4 bg-white pt-2">
        <Button
          onClick={onBack}
          className="w-full rounded-none bg-purple-700 py-5 text-sm tracking-wide text-white hover:bg-purple-800"
        >
          Save changes
        </Button>

        <div className="mt-2 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button className="cursor-pointer text-purple-700 underline">
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}