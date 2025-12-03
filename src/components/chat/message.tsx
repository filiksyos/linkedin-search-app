'use client'

import { ChatUIMessage } from '@/lib/chat-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BotIcon, UserIcon, Linkedin, ExternalLink, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageProps {
  message: any // Using any to handle AI SDK's message structure
}

function LinkedInResults({ output }: { output: { success: boolean; profiles?: Array<{ title: string; url: string; summary: string; score: number }>; error?: string } }) {
  if (!output.success || !output.profiles) {
    return (
      <div className="text-sm text-destructive">
        {output.error || 'Failed to search LinkedIn profiles'}
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-2">
      <div className="text-sm font-medium text-muted-foreground">
        Found {output.profiles.length} LinkedIn profiles:
      </div>
      {output.profiles.map((profile, idx) => (
        <div
          key={idx}
          className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline flex items-center gap-1"
              >
                {profile.title}
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {profile.summary}
              </p>
              {profile.score && (
                <div className="text-xs text-muted-foreground mt-1">
                  Relevance: {(profile.score * 100).toFixed(0)}%
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-6 max-w-4xl mx-auto',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {isUser ? <UserIcon className="h-4 w-4" /> : <BotIcon className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          'flex-1 space-y-2 overflow-hidden',
          isUser ? 'text-right' : 'text-left'
        )}
      >
        {message.parts?.map((part: any, idx: number) => {
          if (part.type === 'text') {
            return (
              <div
                key={`${message.id}-text-${idx}`}
                className={cn(
                  'inline-block rounded-lg px-4 py-2 max-w-full',
                  isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {part.text || ''}
                  </ReactMarkdown>
                </div>
              </div>
            )
          }

          if (part.type === 'tool-search_linkedin') {
            return (
              <div
                key={`${message.id}-tool-${part.toolCallId || idx}`}
                className="rounded-lg border bg-card p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Linkedin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {part.state === 'input-streaming' || part.state === 'input-available'
                      ? 'Searching LinkedIn...'
                      : part.state === 'output-error'
                        ? 'Search Error'
                        : 'LinkedIn Search Results'}
                  </span>
                  {(part.state === 'input-streaming' || part.state === 'input-available') && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
                {part.input?.query && (
                  <div className="text-sm text-muted-foreground mb-2">
                    Query: &quot;{part.input.query}&quot;
                  </div>
                )}
                {part.state === 'output-available' && part.output && (
                  <LinkedInResults output={part.output} />
                )}
                {part.state === 'output-error' && (
                  <div className="text-sm text-destructive">
                    {part.errorText || 'An error occurred while searching'}
                  </div>
                )}
              </div>
            )
          }

          return null
        }) || (
          // Fallback: if no parts, display text directly
          <div
            className={cn(
              'inline-block rounded-lg px-4 py-2 max-w-full',
              isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            )}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text || message.content || ''}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
