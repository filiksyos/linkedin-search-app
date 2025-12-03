'use client'

import { ChatUIMessage, useSharedChatContext } from '@/lib/chat-context'
import { useChat } from '@ai-sdk/react'
import { Message } from './message'
import { ChatInput } from './chat-input'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Linkedin } from 'lucide-react'

export function Chat() {
  const { chat } = useSharedChatContext()
  const { messages, sendMessage, status } = useChat<ChatUIMessage>({ 
    chat
  })

  const handleSendMessage = (text: string) => {
    sendMessage({ text })
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
          <Linkedin className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold">LinkedIn Search</h1>
        </div>
      </div>

      {/* Messages Area */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Linkedin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Search LinkedIn Profiles</p>
            <p className="text-sm">Ask me to find people on LinkedIn and I&apos;ll search for you.</p>
            <p className="text-xs mt-4 text-muted-foreground/70">Examples: &quot;Find AI engineers&quot;, &quot;Anthropic developers&quot;</p>
          </div>
        </div>
      ) : (
        <Conversation className="flex-1">
          <ConversationContent className="space-y-4">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={status === 'streaming' || status === 'submitted'}
      />
    </div>
  )
}
            <MessageCircleIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Generate GitHub search queries</p>
            <p className="text-sm">Ask me to find repositories and I&apos;ll create targeted search links for you.</p>
          </div>
        </div>
      ) : (
        <Conversation className="flex-1">
          <ConversationContent className="space-y-4">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={status === 'streaming' || status === 'submitted'}
      />

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  )
}
