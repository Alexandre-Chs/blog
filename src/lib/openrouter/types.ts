export interface OpenRouterModel {
  id: string
  name: string
  description?: string
  context_length: number
  pricing: {
    prompt: string
    completion: string
    request: string
    image: string
  }
  architecture?: {
    modality: string
    tokenizer: string
  }
  created?: number
  top_provider?: {
    context_length: number
    max_completion_tokens: number
    is_moderated: boolean
  }
}
