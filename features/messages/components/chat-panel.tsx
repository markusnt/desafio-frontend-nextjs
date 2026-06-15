"use client";

import { MessageSquareOff } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useConversationSearch } from "@/features/conversations/hooks/use-conversation-search";
import { useConversation } from "@/features/conversations/hooks/use-conversation";
import { ChatHeader } from "@/features/messages/components/chat-header";
import { MessageComposer } from "@/features/messages/components/message-composer";
import { MessageList } from "@/features/messages/components/message-list";
import { useMarkConversationRead } from "@/features/messages/hooks/use-mark-conversation-read";
import { cn } from "@/lib/utils";
import { isValidConversationId } from "@/lib/validation";

interface ChatPanelProps {
  conversationId: string;
}

export function ChatPanel({ conversationId }: ChatPanelProps) {
  const { inboxHref } = useConversationSearch();
  const { conversation, isLoading, isError, refetch } = useConversation(conversationId);

  useMarkConversationRead(conversationId);

  const isInvalidId = !isValidConversationId(conversationId);
  const isNotFound = !isLoading && !isError && !conversation && !isInvalidId;

  if (isInvalidId || isNotFound) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <ChatHeader
          conversation={undefined}
          isLoading={false}
          isError={false}
          backHref={inboxHref}
        />
        <EmptyState
          icon={MessageSquareOff}
          title="Conversa não encontrada"
          description="Este link pode estar desatualizado ou a conversa foi removida."
          action={
            <Link href={inboxHref} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Voltar para o inbox
            </Link>
          }
          className="flex-1"
        />
      </div>
    );
  }

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
