'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInSchema, type SignInFormData } from '@/lib/validations/auth'
import { useLogin } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  onSwitchToSignUp: () => void
  onSuccess: () => void
}

export default function LoginForm({
  onSwitchToSignUp,
  onSuccess,
}: LoginFormProps) {
  const { mutate: login, isPending } = useLogin()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  function onSubmit(data: SignInFormData) {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          onSuccess()
          router.push('/shop')
        },
        onError: (error) => {
          console.error(error.message)
        },
      }
    )
  }

  return (
    <div className="flex flex-col px-2">
      <h2 className="mb-6 text-center font-le-jour text-2xl font-normal tracking-[0.2em]">
        WELCOME BACK
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="login-email"
            className="text-sm font-normal text-gray-700"
          >
            Email
          </Label>
          <Input
            id="login-email"
            type="email"
            placeholder="marcusexample@gmail.com"
            className="rounded-none border-gray-300"
            style={{ fontFamily: 'var(--font-cormorant-garamond)' }}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="login-password"
            className="text-sm font-normal text-gray-700"
          >
            Password
          </Label>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••••••••••••"
            className="rounded-none border-gray-300"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Forgot password?{' '}
            <span className="cursor-pointer text-purple-700 underline">
              click here
            </span>
          </p>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="mt-1 w-full py-5 text-sm tracking-wide text-white hover:bg-purple-800"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        Don&apos;t have an account?{' '}
        <button
          onClick={onSwitchToSignUp}
          className="cursor-pointer text-primary underline"
        >
          Sign up
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
