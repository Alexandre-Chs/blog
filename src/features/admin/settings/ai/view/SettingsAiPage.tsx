import { useEffect } from 'react'
import { revalidateLogic, useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { SettingsAiFormSchema, settingsAiList, settingsAiUpdate } from '../api/settings'
import type { AnyFieldApi } from '@tanstack/react-form'
import NavigationName from '@/components/ui/navigation-name'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

export default function SettingsAiPage() {
  const settingsAiUpdateFn = useServerFn(settingsAiUpdate)
  const settingsAiListFn = useServerFn(settingsAiList)
  const router = useRouter()

  const { data: settingsAiData, isSuccess } = useQuery({
    queryKey: ['settingsAi'],
    queryFn: () => settingsAiListFn(),
  })

  const settingsAiMutation = useMutation({
    mutationFn: settingsAiUpdateFn,
    onSuccess: () => {
      toast.success('Settings updated successfully!')
      router.invalidate()
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
    if (isSuccess) {
      const value = settingsAiData

      form.reset({
        context: value.context,
        defaultModel: value.defaultModel,
      })
    }
  }, [settingsAiData])

  const form = useForm({
    defaultValues: {
      context: '',
      defaultModel: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: SettingsAiFormSchema,
    },
    onSubmit: ({ value }) => {
      settingsAiMutation.mutate({ data: { context: value.context, defaultModel: value.defaultModel } })
    },
  })

  return (
    <>
      <NavigationName name="AI Settings" subtitle="Configure your AI preferences" />
      <div className="flex flex-col gap-2 max-w-3xl mx-auto pt-6 w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="space-y-8">
            <form.Field
              name="context"
              children={(field) => (
                <>
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor={field.name}>AI Context</Label>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Describe your project here to guide AI generation."
                    />
                  </div>
                  <FieldInfo field={field} />
                </>
              )}
            />

            <form.Field
              name="defaultModel"
              children={(field) => (
                <>
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor={field.name}>Default AI Model</Label>

                    <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>OpenRouter Models</SelectLabel>
                          <SelectItem value="openrouter/anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                          <SelectItem value="openrouter/openai/gpt-4.1">GPT‑4.1</SelectItem>
                          <SelectItem value="openrouter/google/gemini-flash-1.5">Gemini Flash 1.5</SelectItem>
                          <SelectItem value="openrouter/meta/llama-3.1-70b">Llama 3.1 70B</SelectItem>
                          <SelectItem value="openrouter/qwen/qwen2.5-72b">Qwen 2.5 72B</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <FieldInfo field={field} />
                </>
              )}
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
    </>
  )
}
