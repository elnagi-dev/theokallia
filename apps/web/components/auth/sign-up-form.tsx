'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth'
import { useRegister } from '@/hooks/use-auth'

interface SignUpFormProps {
  onSwitchToLogin: () => void
  onSwitchToOtp: (email: string) => void
}

export default function SignUpForm({
  onSwitchToLogin,
  onSwitchToOtp,
}: SignUpFormProps) {
  const { mutate: register, isPending } = useRegister()

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  function onSubmit(data: SignUpFormData) {
    register(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          onSwitchToOtp(data.email)
        },
        onError: (error) => {
          console.error(error.message)
        },
      }
    )
  }

  return (
    <div className="flex flex-col px-2">
      <h2
        className="mb-6 text-center text-2xl font-normal tracking-[0.2em]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        CREATE ACCOUNT
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            {...field('firstName')}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName.message}</p>
          )}
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
            {...field('lastName')}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName.message}</p>
          )}
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
            {...field('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
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
            {...field('password')}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
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
            {...field('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
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
          type="submit"
          disabled={isPending}
          className="mt-1 w-full rounded-none bg-purple-700 py-5 text-sm tracking-wide text-white hover:bg-purple-800"
        >
          {isPending ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

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
