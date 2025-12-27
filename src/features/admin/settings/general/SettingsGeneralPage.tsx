import { revalidateLogic, useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { s3SignedUrlCreate } from '../../../../lib/s3-signed-url-create.api'
import {
  settingsGeneralFaviconUpdate,
  settingsGeneralUpdate,
  settingsGeneralUpdateSchema,
} from './settings-general-update.api'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import NavigationName from '@/components/ui/navigation-name'
import { settingsGeneralRead } from './settings-general-read.api'

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

export default function SettingsGeneralPage() {
  const settingsGeneralReadFn = useServerFn(settingsGeneralRead)
  const settingsGeneralUpdateFn = useServerFn(settingsGeneralUpdate)
  const mediaSignedUrlFn = useServerFn(s3SignedUrlCreate)
  const settingsGeneralFaviconUpdateFn = useServerFn(settingsGeneralFaviconUpdate)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: settingsGeneralData, isSuccess } = useQuery({
    queryKey: ['settingsGeneral'],
    queryFn: () => settingsGeneralReadFn(),
  })

  const settingsGeneralMutation = useMutation({
    mutationFn: settingsGeneralUpdateFn,
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

  const handleUploadFavicon = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]
    if (!file) return

    try {
      const { presigned, key } = await mediaSignedUrlFn({
        data: { contentType: file.type || 'application/octet-stream', size: file.size, type: 'favicon' },
      })

      const res = await fetch(presigned, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })

      if (!res.ok) {
        toast.error('Upload failed with status ' + res.status)
        return
      }

      await settingsGeneralFaviconUpdateFn({ data: { key, mimetype: file.type } })

      queryClient.invalidateQueries({ queryKey: ['settingsGeneral'] })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred during the upload.')
      }
    }
  }

  const handleDeleteFavicon = async () => {
    await settingsGeneralFaviconUpdateFn({ data: { key: null, mimetype: null } })
    queryClient.invalidateQueries({ queryKey: ['settingsGeneral'] })
  }

  useEffect(() => {
    if (isSuccess) {
      const value = settingsGeneralData.general

      form.reset({
        name: value.name,
        tagline: value.tagline ?? '',
      })
    }
  }, [settingsGeneralData])

  const form = useForm({
    defaultValues: {
      name: '',
      tagline: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: settingsGeneralUpdateSchema,
    },
    onSubmit: ({ value }) => {
      settingsGeneralMutation.mutate({ data: { name: value.name, tagline: value.tagline.trim() } })
    },
  })

  return (
    <>
      <NavigationName name="General Settings" subtitle="Manage your project's basic configuration" />
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
            <form.Field
              name="tagline"
              children={(field) => {
                return (
                  <>
                    <div className="grid w-full items-center gap-3">
                      <Label htmlFor={field.name}>Tagline (next to logo)</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Displayed next to the logo when not empty"
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

        <Separator className="my-6" />

        <div className="flex flex-col gap-4">
          <Label htmlFor="favicon-upload">Favicon</Label>
          <div>
            {settingsGeneralData?.favicon.url && (
              <div className="flex items-center gap-2">
                <img src={settingsGeneralData.favicon.url} alt="favicon image" className="w-8 h-8" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('favicon-upload')?.click()}
                >
                  Change
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={handleDeleteFavicon}>
                  Delete
                </Button>
              </div>
            )}
            <Input
              id="favicon-upload"
              type="file"
              accept="image/x-icon,image/png,image/svg+xml"
              onChange={handleUploadFavicon}
              className={settingsGeneralData?.favicon.url ? 'hidden' : ''}
            />
            <p className="text-sm text-gray-500 mt-2">
              Add a favicon for your site. A <strong>.ico</strong> file is ideal, but <strong>.png</strong> and{' '}
              <strong>.svg</strong> are also supported. <br />
              Recommended sizes: <strong>32×32</strong> or <strong>64×64</strong>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
