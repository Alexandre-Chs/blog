import { revalidateLogic, useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { settingsGeneralList, settingsGeneralUpdate, settingsGeneralformSchema } from '../api/list'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid
        ? field.state.meta.errors.map((err) => <em key={err.message}>{err.message}</em>)
        : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

export default function SettingsPage() {
  const { data: defaultFormValue, isSuccess } = useQuery({
    queryKey: ['settingsGeneral'],
    queryFn: () => settingsGeneralList(),
  })

  const settingsGeneralMutation = useMutation({
    mutationFn: settingsGeneralUpdate,
    onSuccess: () => {
      toast.success('Settings updated successfully!')
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An error occurred while updating the article.')
      }
    },
  })

  useEffect(() => {
    if (isSuccess) form.reset(defaultFormValue)
  }, [defaultFormValue])

  console.log('la data value', defaultFormValue)
  const form = useForm({
    defaultValues: {
      name: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: settingsGeneralformSchema,
    },
    onSubmit: ({ value }) => {
      settingsGeneralMutation.mutate({ data: { name: value.name } })
      console.log(value)
    },
  })

  return (
    <div className="flex flex-col gap-2 max-w-md mx-auto pt-6 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          <form.Field
            name="name"
            children={(field) => {
              return (
                <>
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor={field.name}>Edit name project</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Edit name project"
                    />
                  </div>
                  <FieldInfo field={field} />
                </>
              )
            }}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  )
}
