'use client'

import { useStickToBottom } from 'use-stick-to-bottom'
import { ReactNode } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ArrowDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConversationProps {
  children: ReactNode
  className?: string
}

export function Conversation({ children, className }: ConversationProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
    </div>
  )
}

interface ConversationContentProps {
  children: ReactNode
  className?: string
}

export function ConversationContent({ children, className }: ConversationContentProps) {
  const { scrollRef } = useStickToBottom()

  return (
    <ScrollArea className="h-full w-full">
      <div ref={scrollRef} className={cn('pb-4', className)}>
        {children}
      </div>
    </ScrollArea>
  )
}

export function ConversationScrollButton() {
  const { isAtBottom, scrollToBottom } = useStickToBottom()

  if (isAtBottom) return null

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <Button
        onClick={scrollToBottom}
        size="icon"
        variant="outline"
        className="rounded-full shadow-lg"
      >
        <ArrowDownIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
