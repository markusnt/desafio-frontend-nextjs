"use client";

import { MessageSquareOff, SearchX } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "@/features/conversations/components/conversation-item";
import { ConversationListSkeleton } from "@/features/conversations/components/conversation-list-skeleton";
import { ConversationSearch } from "@/features/conversations/components/conversation-search";
import { useConversationSearch } from "@/features/conversations/hooks/use-conversation-search";
import { useConversations } from "@/features/conversations/hooks/use-conversations";
import { filterConversations } from "@/features/conversations/utils/filter-conversations";

export function ConversationList() {
  const params = useParams<{ conversationId?: string }>();
  const selectedId = params.conversationId ?? null;
  const { search, buildConversationHref } = useConversationSearch();
  const { conversations, isLoading, isError, refetch } = useConversations();

  const filtered = filterConversations(conversations, search);
  const totalUnread = conversations.reduce((sum, conversation) => sum + conversation.unread, 0);

  return (
    <aside className="flex h-full flex-col">
      <div className="space-y-3 px-4 pb-3 pt-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Conversas</h2>
            {!isLoading && conversations.length > 0 ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {search
                  ? `${filtered.length} de ${conversations.length} contatos`
                  : `${conversations.length} contatos`}
              </p>
            ) : null}
          </div>
          {!isLoading && totalUnread > 0 ? (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
              {totalUnread > 99 ? "99+" : totalUnread} novas
            </span>
          ) : null}
        </div>
        <ConversationSearch />
      </div>

      {isLoading ? (
        <ConversationListSkeleton />
      ) : isError ? (
        <EmptyState
          title="Erro ao carregar conversas"
          description="Não foi possível buscar a lista. Verifique sua conexão e tente novamente."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          }
          className="flex-1"
        />
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquareOff}
          title="Nenhuma conversa"
          description="Quando novos contatos entrarem em contato, eles aparecerão aqui."
          className="flex-1"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Nenhum resultado"
          description={`Nenhuma conversa encontrada para "${search}".`}
          className="flex-1"
        />
      ) : (
        <ScrollArea className="min-h-0 flex-1 px-2 pb-2">
          <div role="listbox" aria-label="Lista de conversas" className="flex flex-col gap-1">
            {filtered.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                href={buildConversationHref(conversation.id)}
                isSelected={selectedId === conversation.id}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </aside>
  );
}
