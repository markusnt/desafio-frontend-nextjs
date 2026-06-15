"use client";

import { MessageSquareOff } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { isOptimisticMessage, MessageBubble } from "@/features/messages/components/message-bubble";
import { MessageListSkeleton } from "@/features/messages/components/message-list-skeleton";
import { useMessages } from "@/features/messages/hooks/use-messages";

interface MessageListProps {
  conversationId: string;
}

const SCROLL_THRESHOLD_PX = 100;

function isNearBottom(element: HTMLElement, threshold = SCROLL_THRESHOLD_PX): boolean {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= threshold;
}

export function MessageList({ conversationId }: MessageListProps) {
  const { messages, isLoading, isPlaceholderData, isError, refetch } = useMessages(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrolledForConversationRef = useRef<string | null>(null);
  const lastMessage = messages.at(-1);
  const lastMessageId = lastMessage?.id;

  useEffect(() => {
    scrolledForConversationRef.current = null;
  }, [conversationId]);

  useEffect(() => {
    if (isLoading || isPlaceholderData || messages.length === 0) {
      return;
    }

    const container = scrollRef.current;
    const forceScroll = lastMessage ? isOptimisticMessage(lastMessage) : false;
    const isFirstPaint = scrolledForConversationRef.current !== conversationId;

    if (isFirstPaint || forceScroll || (container && isNearBottom(container))) {
      bottomRef.current?.scrollIntoView({ block: "end", behavior: "auto" });
      scrolledForConversationRef.current = conversationId;
    }
  }, [conversationId, isLoading, isPlaceholderData, lastMessage, lastMessageId, messages.length]);

  if (isLoading || isPlaceholderData) {
    return <MessageListSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Erro ao carregar mensagens"
        description="Não foi possível buscar o histórico desta conversa. Tente novamente."
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        }
        className="flex-1"
      />
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareOff}
        title="Nenhuma mensagem ainda"
        description="Quando o contato enviar uma mensagem, ela aparecerá aqui."
        className="flex-1"
      />
    );
  }

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-2" role="log" aria-label="Histórico de mensagens">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} aria-hidden />
      </div>
    </div>
  );
}
