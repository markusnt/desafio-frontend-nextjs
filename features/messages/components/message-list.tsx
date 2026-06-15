"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { MessageSquareOff } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { isOptimisticMessage, MessageBubble } from "@/features/messages/components/message-bubble";
import { MessageListSkeleton } from "@/features/messages/components/message-list-skeleton";
import { useMessages } from "@/features/messages/hooks/use-messages";
import { messageKeys } from "@/features/messages/queries";
import { mergeMessages } from "@/features/messages/utils/merge-messages";
import { getMessages, type Message } from "@/lib/api";
import { formatDateSeparator, getMessageDateKey } from "@/lib/format";

interface MessageListProps {
  conversationId: string;
  contactName?: string;
}

const SCROLL_THRESHOLD_PX = 100;
const ESTIMATED_ROW_HEIGHT = 72;
const SEPARATOR_ROW_HEIGHT = 40;

type MessageListItem =
  | { type: "separator"; id: string; label: string }
  | { type: "message"; id: string; message: Message };

function isNearBottom(element: HTMLElement, threshold = SCROLL_THRESHOLD_PX): boolean {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= threshold;
}

function truncateText(text: string, maxLength = 100): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}…`;
}

function buildListItems(messages: Message[]): MessageListItem[] {
  const items: MessageListItem[] = [];
  let previousDateKey: string | null = null;

  for (const message of messages) {
    const dateKey = getMessageDateKey(message.createdAt);

    if (dateKey !== previousDateKey) {
      items.push({
        type: "separator",
        id: `separator-${dateKey}`,
        label: formatDateSeparator(message.createdAt),
      });
      previousDateKey = dateKey;
    }

    items.push({ type: "message", id: message.id, message });
  }

  return items;
}

export function MessageList({ conversationId, contactName }: MessageListProps) {
  const queryClient = useQueryClient();
  const { messages, isLoading, isPlaceholderData, isError, refetch } = useMessages(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrolledForConversationRef = useRef<string | null>(null);
  const knownMessageIdsRef = useRef<Set<string>>(new Set());
  const loadingOlderRef = useRef(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const listItems = useMemo(() => buildListItems(messages), [messages]);
  const lastMessage = messages.at(-1);
  const lastMessageId = lastMessage?.id;

  const virtualizer = useVirtualizer({
    count: listItems.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) =>
      listItems[index]?.type === "separator" ? SEPARATOR_ROW_HEIGHT : ESTIMATED_ROW_HEIGHT,
    overscan: 8,
  });

  const loadOlderMessages = useCallback(async () => {
    if (loadingOlderRef.current || messages.length === 0) {
      return;
    }

    const oldest = messages[0];
    if (!oldest || isOptimisticMessage(oldest)) {
      return;
    }

    loadingOlderRef.current = true;
    const container = scrollRef.current;
    const previousHeight = container?.scrollHeight ?? 0;

    try {
      const older = await getMessages(conversationId, {
        before: oldest.createdAt,
        limit: 50,
      });

      if (older.length === 0) {
        return;
      }

      queryClient.setQueryData(
        messageKeys.byConversation(conversationId),
        mergeMessages(messages, older),
      );

      requestAnimationFrame(() => {
        if (!container) {
          return;
        }

        container.scrollTop += container.scrollHeight - previousHeight;
      });
    } catch {
      toast.error("Não foi possível carregar mensagens anteriores");
    } finally {
      loadingOlderRef.current = false;
    }
  }, [conversationId, messages, queryClient]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    function handleScroll() {
      if (!container || container.scrollTop > 48) {
        return;
      }

      void loadOlderMessages();
    }

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadOlderMessages]);

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
    if (isLoading || isPlaceholderData || listItems.length === 0) {
      return;
    }

    const container = scrollRef.current;
    const forceScroll = lastMessage ? isOptimisticMessage(lastMessage) : false;
    const isFirstPaint = scrolledForConversationRef.current !== conversationId;

    if (isFirstPaint || forceScroll || (container && isNearBottom(container))) {
      virtualizer.scrollToIndex(listItems.length - 1, { align: "end" });
      scrolledForConversationRef.current = conversationId;
    }
  }, [
    conversationId,
    isLoading,
    isPlaceholderData,
    lastMessage,
    lastMessageId,
    listItems.length,
    virtualizer,
  ]);

  if (isLoading || isPlaceholderData) {
    return <MessageListSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Erro ao carregar mensagens"
        description="Não foi possível buscar o histórico desta conversa. Verifique sua conexão e tente novamente."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refetch().catch(() => {
                toast.error("Falha ao recarregar mensagens");
              });
            }}
          >
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
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        <div
          className="relative w-full"
          role="log"
          aria-label="Histórico de mensagens"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const item = listItems[virtualItem.index];
            if (!item) {
              return null;
            }

            return (
              <div
                key={item.id}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full pb-2"
                style={{ transform: `translateY(${virtualItem.start}px)` }}
              >
                {item.type === "separator" ? (
                  <div
                    className="flex justify-center py-2"
                    role="separator"
                    aria-label={item.label}
                  >
                    <span className="rounded-full bg-muted/80 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <MessageBubble message={item.message} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
