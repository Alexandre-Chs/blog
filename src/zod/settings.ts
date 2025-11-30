import z from 'zod'

export const settingsSchemas = {
  general: z.object({
    name: z.string().min(1),
    tagline: z.string().optional(),
  }),

  about: z.object({
    content: z.string().min(1),
  }),

  favicon: z.object({
    key: z.string().min(1),
    mimetype: z.string().min(1),
    url: z.url(),
  }),

  ai: z.object({
    context: z.string(),
    defaultModel: z.string(),
  }),
}

export type SettingsMap = {
  [T in keyof typeof settingsSchemas]: z.infer<(typeof settingsSchemas)[T]>
}

export function validateSettings<T extends keyof SettingsMap>(key: T, value: unknown): SettingsMap[T] {
  return settingsSchemas[key].parse(value) as SettingsMap[T]
}
