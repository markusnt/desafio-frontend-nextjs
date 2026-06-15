"use client";

import { useConversationSearch } from "@/features/conversations/hooks/use-conversation-search";
import { useConversation } from "@/features/conversations/hooks/use-conversation";
import { ChatHeader } from "@/features/messages/components/chat-header";
import { MessageComposer } from "@/features/messages/components/message-composer";
import { MessageList } from "@/features/messages/components/message-list";

interface ChatPanelProps {
  conversationId: string;
}

export function ChatPanel({ conversationId }: ChatPanelProps) {
  const { inboxHref } = useConversationSearch();
  const { conversation, isLoading, isError, refetch } = useConversation(conversationId);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader
        conversation={conversation}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        backHref={inboxHref}
      />
      <MessageList
        conversationId={conversationId}
        contactName={conversation?.contactName}
      />
      <MessageComposer conversationId={conversationId} />
    </div>
  );
}
