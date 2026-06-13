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

  return (
    <aside className="flex h-full flex-col bg-background">
      <div className="border-b pt-3">
        <h2 className="px-3 pb-3 text-sm font-semibold">Conversas</h2>
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
        <ScrollArea className="min-h-0 flex-1">
          <div role="listbox" aria-label="Lista de conversas" className="flex flex-col gap-0.5 p-2">
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
