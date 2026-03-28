'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'
import { useResetPassword } from '@/hooks/use-auth'

interface ResetPasswordFormProps {
  email: string
  onSuccess: () => void
  onTerms: () => void
  onPrivacy: () => void
}

export default function ResetPasswordForm({ email, onSuccess, onTerms, onPrivacy }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate: resetPassword, isPending } = useResetPassword()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  function onSubmit(data: ResetPasswordInput) {
    resetPassword(
      { email, password: data.password },
      {
        onSuccess: () => onSuccess(),
        onError: (error) => {
          setError('root', {
            message: error.message ?? 'Something went wrong. Please try again.',
          })
        },
      }
    )
  }

  return (
    <div className="flex flex-col px-2">
      <h2 className="mb-8 text-center font-cormorant-garamond text-3xl font-normal leading-snug">
        Create a New Password
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-password" className="text-sm font-normal text-gray-700">
            New password
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              className="rounded-none border-gray-300 pr-10"
              disabled={isPending}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff size={16} strokeWidth={1.5} />
              ) : (
                <Eye size={16} strokeWidth={1.5} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm-password" className="text-sm font-normal text-gray-700">
            Confirm New password
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              className="rounded-none border-gray-300 pr-10"
              disabled={isPending}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? (
                <EyeOff size={16} strokeWidth={1.5} />
              ) : (
                <Eye size={16} strokeWidth={1.5} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="text-xs text-red-500">{errors.root.message}</p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full py-5 text-sm tracking-wide text-white hover:bg-purple-800"
        >
          {isPending ? 'Saving...' : 'Save Password'}
        </Button>
      </form>

      <div className="mt-8 flex justify-center gap-3 text-xs text-gray-400">
        <span onClick={onTerms} className="cursor-pointer hover:text-gray-600">Terms of service</span>
        <span>|</span>
        <span onClick={onPrivacy} className="cursor-pointer hover:text-gray-600">Privacy policy</span>
      </div>
    </div>
  )
}