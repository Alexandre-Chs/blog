import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import z from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth/auth-client'
import { loginSchema } from '@/lib/zod'

type LoginProps = {
  existUser: boolean
}

export function Login({ existUser }: LoginProps) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | undefined>(undefined)

  const navigate = useNavigate()

  const handleLoginFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: e.target.value }))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const login = loginSchema.parse(loginForm)
      const { error: authError } = await authClient.signIn.email(
        {
          email: login.email,
          password: login.password,
          rememberMe: false,
        },
        {},
      )
      if (authError) {
        setError(authError.message)
        return
      }

      navigate({ to: '/admin' })
    } catch (err) {
      if (err instanceof z.ZodError) setError(err.issues.map((issue) => issue.message).join(', '))
      else setError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn('flex flex-col gap-6')}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      required
                      onChange={handleLoginFormChange}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" name="password" onChange={handleLoginFormChange} required />
                  </Field>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Field>
                    <Button type="submit" className="cursor-pointer">
                      Login
                    </Button>
                    {!existUser && (
                      <FieldDescription className="text-center">
                        Don&apos;t have an account? <Link to="/admin/sign-up">Sign up</Link>
                      </FieldDescription>
                    )}
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
