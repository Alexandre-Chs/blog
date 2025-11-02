import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth/auth-client'
import { signUpSchema } from '@/lib/zod'

type SignUpFormType = {
  email: string
  password: string
  confirmPassword: string
}

export default function SignUpPage() {
  const [signUpForm, setSignUpForm] = useState<SignUpFormType>({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | undefined>(undefined)
  const navigate = useNavigate()

  const handleSignUpFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    setSignUpForm((prev) => ({ ...prev, [name]: e.target.value }))
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    try {
      const signUpData = signUpSchema.parse(signUpForm)

      const { error: signUpError } = await authClient.signUp.email(
        { email: signUpData.email, password: signUpData.password, name: '' },
        {
          onSuccess: () => {
            navigate({ to: '/' })
          },
        },
      )

      if (signUpError) {
        setError(signUpError.message)
        return
      }
    } catch (err) {
      if (err instanceof z.ZodError) setError(err.issues.map((issue) => issue.message).join(', '))
      else setError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Enter your information below to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    onChange={handleSignUpFormChange}
                    placeholder="email@example.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" name="password" onChange={handleSignUpFormChange} required />
                  <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    name="confirmPassword"
                    onChange={handleSignUpFormChange}
                    required
                  />
                  <FieldDescription>Please confirm your password.</FieldDescription>
                </Field>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <FieldGroup>
                  <Field>
                    <Button type="submit">Create Account</Button>
                    <FieldDescription className="px-6 text-center">
                      Already have an account? <Link to="/admin/login">Login</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
