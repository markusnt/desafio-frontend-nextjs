"use client";

import { useConversation } from "@/features/conversations/hooks/use-conversation";
import { ChatHeader } from "@/features/messages/components/chat-header";
import { MessageComposer } from "@/features/messages/components/message-composer";
import { MessageList } from "@/features/messages/components/message-list";

interface ChatPanelProps {
  conversationId: string;
}

export function ChatPanel({ conversationId }: ChatPanelProps) {
  const { conversation, isLoading } = useConversation(conversationId);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader conversation={conversation} isLoading={isLoading && !conversation} />
      <MessageList conversationId={conversationId} />
      <MessageComposer conversationId={conversationId} />
    </div>
  );
}
