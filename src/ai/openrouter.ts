import { createOpenRouter } from '@openrouter/ai-sdk-provider'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export function getOpenRouterModel() {
  const modelId = process.env.AI_MODEL || 'google/gemini-2.5-pro'
  return openrouter.chat(modelId)
}

export function getModelId() {
  return process.env.AI_MODEL || 'google/gemini-2.5-pro'
}
