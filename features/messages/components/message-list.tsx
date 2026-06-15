"use client";

import { MessageSquareOff } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageBubble } from "@/features/messages/components/message-bubble";
import { MessageListSkeleton } from "@/features/messages/components/message-list-skeleton";
import { useMessages } from "@/features/messages/hooks/use-messages";

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const { messages, isLoading, isError, refetch } = useMessages(conversationId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages.at(-1)?.id;

  useEffect(() => {
    if (isLoading || messages.length === 0) {
      return;
    }

    bottomRef.current?.scrollIntoView({ block: "end", behavior: "auto" });
  }, [conversationId, isLoading, lastMessageId, messages.length]);

  if (isLoading) {
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
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-2" role="log" aria-label="Histórico de mensagens">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} aria-hidden />
      </div>
    </div>
  );
}
