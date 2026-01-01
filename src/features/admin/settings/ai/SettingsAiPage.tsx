import { useState } from 'react'
import { revalidateLogic, useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Check, ChevronsUpDown } from 'lucide-react'
import { settingsAiRead } from './settings-ai-read.api'
import { settingsAiUpdate, settingsAiUpdateSchema } from './settings-ai-update.api'
import type { AnyFieldApi } from '@tanstack/react-form'
import NavigationName from '@/components/ui/navigation-name'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { getOpenrouterModels } from '@/lib/openrouter/api'

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
  const [open, setOpen] = useState(false)
  const settingsAiUpdateFn = useServerFn(settingsAiUpdate)
  const settingsAiReadFn = useServerFn(settingsAiRead)
  const getOpenrouterModelsFn = useServerFn(getOpenrouterModels)
  const router = useRouter()

  const { data: settingsAiData } = useQuery({
    queryKey: ['settingsAi'],
    queryFn: () => settingsAiReadFn(),
  })

  const { data: models } = useQuery({
    queryKey: ['openrouterModels'],
    queryFn: async () => await getOpenrouterModelsFn(),
  })

  const form = useForm({
    defaultValues: {
      context: settingsAiData?.context ?? '',
      defaultModel: settingsAiData?.defaultModel ?? '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: settingsAiUpdateSchema,
    },
    onSubmit: ({ value }) => {
      settingsAiMutation.mutate({ data: { context: value.context, defaultModel: value.defaultModel } })
    },
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
                    <span className="italic text-xs">
                      You can find all models and their details
                      <a
                        href="https://openrouter.ai/models"
                        target="_blank"
                        className="font-bold text-blue-500 ml-1 hover:underline"
                      >
                        here
                      </a>
                      <br />
                      Type "free" to find all free models.
                    </span>

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {field.state.value
                            ? (models?.find((model) => model.id === field.state.value)?.name ?? field.state.value)
                            : 'Select a model...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search model..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No model found.</CommandEmpty>
                            <CommandGroup heading="OpenRouter Models">
                              {models?.map((model) => (
                                <CommandItem
                                  key={model.id}
                                  value={model.id}
                                  onSelect={(currentValue) => {
                                    field.handleChange(currentValue === field.state.value ? '' : currentValue)
                                    setOpen(false)
                                  }}
                                >
                                  {model.name}
                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      field.state.value === model.id ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
