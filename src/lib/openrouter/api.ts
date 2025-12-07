import { createServerFn } from '@tanstack/react-start'
import OpenAI from 'openai'
import type { OpenRouterModel } from './types'

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
})

export const getOpenrouterModels = createServerFn().handler(async (): Promise<Array<OpenRouterModel>> => {
  const response = await openrouter.models.list()
  return response.data as unknown as Array<OpenRouterModel>
})
