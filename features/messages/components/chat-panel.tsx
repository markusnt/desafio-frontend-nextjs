"use client";

import { useConversations } from "@/features/conversations/hooks/use-conversations";
import { ChatHeader } from "@/features/messages/components/chat-header";
import { MessageList } from "@/features/messages/components/message-list";

interface ChatPanelProps {
  conversationId: string;
}

export function ChatPanel({ conversationId }: ChatPanelProps) {
  const { conversations, isLoading: isLoadingConversations } = useConversations();
  const conversation = conversations.find((item) => item.id === conversationId);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader conversation={conversation} isLoading={isLoadingConversations && !conversation} />
      <MessageList conversationId={conversationId} />
    </div>
  );
}
