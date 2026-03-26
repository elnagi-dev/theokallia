import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SignUpFormProps {
  onSwitchToLogin: () => void
  onSwitchToOtp: () => void
}

export default function SignUpForm({
  onSwitchToLogin,
  onSwitchToOtp,
}: SignUpFormProps) {
  return (
    <div className="flex flex-col px-2">
      <h2
        className="mb-6 text-center text-2xl font-normal tracking-[0.2em]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        CREATE ACCOUNT
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="first-name"
            className="text-sm font-normal text-gray-700"
          >
            First Name
          </Label>
          <Input
            id="first-name"
            type="text"
            className="rounded-none border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="last-name"
            className="text-sm font-normal text-gray-700"
          >
            Last Name
          </Label>
          <Input
            id="last-name"
            type="text"
            className="rounded-none border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-sm font-normal text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="marcusexample@gmail.com"
            className="rounded-none border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="password"
            className="text-sm font-normal text-gray-700"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••••••••••••"
            className="rounded-none border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="confirm-password"
            className="text-sm font-normal text-gray-700"
          >
            Confirm Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••••••••••••"
            className="rounded-none border-gray-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="terms"
            type="checkbox"
            className="h-3.5 w-3.5 accent-purple-700"
          />
          <label htmlFor="terms" className="text-xs text-gray-600">
            Agree to{' '}
            <span className="cursor-pointer text-purple-700 underline">
              terms
            </span>{' '}
            and conditions
          </label>
        </div>

        <Button
          onClick={onSwitchToOtp}
          className="mt-1 w-full rounded-none bg-purple-700 py-5 text-sm tracking-wide text-white hover:bg-purple-800"
        >
          Create Account
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="cursor-pointer text-purple-700 underline"
        >
          Sign in
        </button>
      </p>

      <div className="mt-6 flex justify-center gap-3 text-xs text-gray-400">
        <span className="cursor-pointer hover:text-gray-600">
          Terms of service
        </span>
        <span>|</span>
        <span className="cursor-pointer hover:text-gray-600">
          Privacy policy
        </span>
      </div>
    </div>
  )
}
