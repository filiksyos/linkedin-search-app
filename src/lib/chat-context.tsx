'use client'

import { type ReactNode, useState } from 'react'
import { Chat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
// DataPart types for future use
// import type { DataPart } from '@/ai/messages/data-parts'
// import { DataUIPart } from 'ai'
import { createContext, useContext, useMemo } from 'react'

export interface ChatUIMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  parts: Array<{
    type: 'text'
    text: string
  }>
}

interface ChatContextValue {
  chat: Chat<ChatUIMessage>
  showUpgradeModal: boolean
  setShowUpgradeModal: (show: boolean) => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const chat = useMemo(
    () =>
      new Chat<ChatUIMessage>({
        transport: new DefaultChatTransport({
          api: '/api/chat'
        }),
        onData: (data) => {
          // Handle data parts for repository search progress
          console.log('Received data:', data)
        },
        onError: (error) => {
          console.error('Error sending message:', error)
          
          // Check if this is a rate limit error (429)
          if (error.message && (
            error.message.includes('RATE_LIMIT_EXCEEDED') || 
            error.message.includes('NO_CREDITS') ||
            error.message.includes('429')
          )) {
            console.log('Rate limit exceeded, showing upgrade modal')
            setShowUpgradeModal(true)
          }
        },
      }),
    []
  )

  return (
    <ChatContext.Provider value={{ 
      chat, 
      showUpgradeModal, 
      setShowUpgradeModal 
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useSharedChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useSharedChatContext must be used within a ChatProvider')
  }
  return context
}
