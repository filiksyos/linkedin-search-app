import type { ChatUIMessage } from '@/lib/chat-context'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  tool,
} from 'ai'
import { getOpenRouterModel } from '@/ai/openrouter'
import Exa from 'exa-js'
import { z } from 'zod'

// Initialize Exa client
const exa = new Exa(process.env.EXA_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as { messages: any[] }

    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        originalMessages: messages as any,
        execute: ({ writer }) => {
          const result = streamText({
            model: getOpenRouterModel(),
            messages: convertToModelMessages(messages),
            system: `You are a helpful LinkedIn search assistant. When users ask you to find people on LinkedIn, use the search_linkedin tool to search for relevant profiles.

Provide clear, concise summaries of the search results and help users discover the right LinkedIn profiles.

Always use professional and helpful language.`,
            tools: {
              search_linkedin: tool({
                description:
                  'Search for LinkedIn profiles based on a query. Use this when the user wants to find people, professionals, or specific roles on LinkedIn.',
                inputSchema: z.object({
                  query: z
                    .string()
                    .describe(
                      'The search query to find LinkedIn profiles (e.g., "AI engineers", "Anthropic developers", "Product managers in San Francisco")'
                    ),
                }),
                execute: async ({ query }) => {
                  try {
                    console.log('🔍 Tool execute called with:', { query, type: typeof query })

                    if (!query) {
                      console.error('❌ Query is missing or undefined')
                      return {
                        success: false,
                        error: 'Query parameter is required',
                      }
                    }

                    console.log('🔍 Searching LinkedIn for:', query)

                    const result = await exa.searchAndContents(query, {
                      category: 'linkedin profile',
                      includeDomains: ['linkedin.com'],
                      text: true,
                      type: 'auto',
                      numResults: 10,
                    })

                    console.log(`✅ Found ${result.results.length} profiles`)

                    return {
                      success: true,
                      profiles: result.results.map((profile) => ({
                        title: profile.title,
                        url: profile.url,
                        summary: profile.text?.substring(0, 300) || 'No summary available',
                        score: profile.score,
                      })),
                    }
                  } catch (error) {
                    console.error('❌ LinkedIn search error:', error)
                    return {
                      success: false,
                      error: 'Failed to search LinkedIn profiles',
                    }
                  }
                },
              }),
            },
            onError: (error) => {
              console.error('Error communicating with AI')
              console.error(JSON.stringify(error, null, 2))
            },
          })
          
          result.consumeStream()
          writer.merge(
            result.toUIMessageStream({
              sendReasoning: false,
              sendStart: false,
            })
          )
        },
      }),
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
