"use client";

import { MessageSquareOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { isOptimisticMessage, MessageBubble } from "@/features/messages/components/message-bubble";
import { MessageListSkeleton } from "@/features/messages/components/message-list-skeleton";
import { useMessages } from "@/features/messages/hooks/use-messages";
import { getMessageDateKey, formatDateSeparator } from "@/lib/format";

interface MessageListProps {
  conversationId: string;
  contactName?: string;
}

const SCROLL_THRESHOLD_PX = 100;

function isNearBottom(element: HTMLElement, threshold = SCROLL_THRESHOLD_PX): boolean {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= threshold;
}

function truncateText(text: string, maxLength = 100): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}…`;
}

export function MessageList({ conversationId, contactName }: MessageListProps) {
  const { messages, isLoading, isPlaceholderData, isError, refetch } = useMessages(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrolledForConversationRef = useRef<string | null>(null);
  const knownMessageIdsRef = useRef<Set<string>>(new Set());
  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const lastMessage = messages.at(-1);
  const lastMessageId = lastMessage?.id;

  useEffect(() => {
    scrolledForConversationRef.current = null;
    knownMessageIdsRef.current = new Set();
    setLiveAnnouncement("");
  }, [conversationId]);

  useEffect(() => {
    if (isLoading || isPlaceholderData) {
      return;
    }

    const newIncoming = messages.filter(
      (message) =>
        message.direction === "in" &&
        !isOptimisticMessage(message) &&
        !knownMessageIdsRef.current.has(message.id),
    );

    for (const message of messages) {
      knownMessageIdsRef.current.add(message.id);
    }

    if (newIncoming.length === 0) {
      return;
    }

    const latest = newIncoming.at(-1);
    if (!latest) {
      return;
    }

    const sender = contactName ? ` de ${contactName}` : "";
    setLiveAnnouncement(`Nova mensagem${sender}: ${truncateText(latest.body)}`);
  }, [contactName, isLoading, isPlaceholderData, messages]);

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
        description="Não foi possível buscar o histórico desta conversa. Verifique sua conexão e tente novamente."
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
        description="Envie a primeira mensagem ou aguarde o contato responder."
        className="flex-1"
      />
    );
  }

  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveAnnouncement}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        <div className="flex flex-col gap-2" role="log" aria-label="Histórico de mensagens">
          {messages.map((message, index) => {
            const dateKey = getMessageDateKey(message.createdAt);
            const previousKey =
              index > 0 ? getMessageDateKey(messages[index - 1].createdAt) : null;
            const showSeparator = dateKey !== previousKey;

            return (
              <div key={message.id} className="contents">
                {showSeparator ? (
                  <div
                    className="flex justify-center py-2"
                    role="separator"
                    aria-label={formatDateSeparator(message.createdAt)}
                  >
                    <span className="rounded-full bg-muted/80 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {formatDateSeparator(message.createdAt)}
                    </span>
                  </div>
                ) : null}
                <MessageBubble message={message} />
              </div>
            );
          })}
          <div ref={bottomRef} aria-hidden />
        </div>
      </div>
    </>
  );
}
