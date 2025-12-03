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
import { MessageCircleIcon, Crown, CheckCircle2 } from 'lucide-react'
import UserAvatar from '@/components/auth/UserAvatar'
import { UpgradeModal } from '@/components/UpgradeModal'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Chat() {
  const { chat, showUpgradeModal, setShowUpgradeModal } = useSharedChatContext()
  const { user, userProfile, loadUserProfile } = useAuth()
  const { messages, sendMessage, status } = useChat<ChatUIMessage>({ 
    chat
  })
  const searchParams = useSearchParams()
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)

  // Handle payment success
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    
    if (paymentStatus === 'success' && user?.id) {
      console.log('🎉 Payment success detected! Reloading user profile...')
      
      // Show success message briefly
      setShowPaymentSuccess(true)
      
      // Sync subscription status with stripe data
      setTimeout(async () => {
        try {
          // Call sync API to update subscription status from stripe_sandbox
          const response = await fetch('/api/subscription/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id })
          })

          if (response.ok) {
            const syncData = await response.json()
            console.log('✅ Subscription synced:', syncData)
            
            // Reload user profile to get the updated data
            await loadUserProfile()
            console.log('✅ Profile reloaded after sync')
          } else {
            console.error('❌ Sync failed, falling back to profile reload')
            await loadUserProfile()
          }
        } catch (error) {
          console.error('❌ Error syncing subscription:', error)
          // Fallback to profile reload
          await loadUserProfile()
        }
        
        // Hide success message after 4 seconds
        setTimeout(() => {
          setShowPaymentSuccess(false)
        }, 4000)
      }, 2000) // Wait 2 seconds for stripe wrapper to sync
      
      // Clean URL
      window.history.replaceState({}, '', '/')
    }
  }, [searchParams, user?.id, loadUserProfile])

  const handleSendMessage = (text: string) => {
    if (!user?.id) {
      console.error('Cannot send message: User not authenticated')
      return
    }
    
    // Pass userId as request-level option (new AI SDK way)
    sendMessage(
      { text },
      {
        body: {
          userId: user.id
        }
      }
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
          <MessageCircleIcon className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold">Anysearch</h1>
          {userProfile?.subscription_status === 'active' && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-full">
              <Crown className="w-3 h-3 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Pro</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <UserAvatar />
        </div>
      </div>

      {/* Payment Success Notification */}
      {showPaymentSuccess && (
        <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-700 dark:text-green-300">
                Welcome to Anysearch Pro! 🎉
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your subscription is now active with 100 searches available.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
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
