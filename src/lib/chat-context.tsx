'use client'

import { type ReactNode } from 'react'
import { Chat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
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
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useMemo(
    () =>
      new Chat<ChatUIMessage>({
        transport: new DefaultChatTransport({
          api: '/api/chat'
        }),
        onData: (data) => {
          // Handle data parts for LinkedIn search progress
          console.log('Received data:', data)
        },
        onError: (error) => {
          console.error('Error sending message:', error)
        },
      }),
    []
  )

  return (
    <ChatContext.Provider value={{ chat }}>
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
    throw new Error('useSharedChatContext must be used within a ChatProvider')
  }
  return context
}
