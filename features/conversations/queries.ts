import { queryOptions } from "@tanstack/react-query";
import type { QueryClient, QueryFunctionContext } from "@tanstack/react-query";

import { getConversations, type Conversation } from "@/lib/api";
import { POLLING, STALE_TIME } from "@/lib/config/polling";

export const conversationKeys = {
  all: ["conversations"] as const,
  list: () => [...conversationKeys.all, "list"] as const,
  /** ETag da lista — par de meta no mesmo QueryClient (meta da Query é read-only no v5). */
  listEtag: () => [...conversationKeys.all, "list", "etag"] as const,
};

interface ConversationsQueryOptions {
  chatOpen?: boolean;
}

function getListEtag(client: QueryClient): string | undefined {
  return client.getQueryData<string>(conversationKeys.listEtag());
}

function setListEtag(client: QueryClient, etag?: string) {
  client.setQueryData(conversationKeys.listEtag(), etag);
}

async function fetchConversations({
  client,
  queryKey,
}: QueryFunctionContext<ReturnType<typeof conversationKeys.list>>): Promise<Conversation[]> {
  const result = await getConversations(getListEtag(client));

  if (result.notModified) {
    const cached = client.getQueryData<Conversation[]>(queryKey);
    if (cached) {
      return cached;
    }

    const full = await getConversations();
    setListEtag(client, full.etag);
    return full.data;
  }

  setListEtag(client, result.etag);
  return result.data;
}

export function conversationsQueryOptions(options: ConversationsQueryOptions = {}) {
  const { chatOpen = false } = options;

  return queryOptions({
    queryKey: conversationKeys.list(),
    queryFn: fetchConversations,
    staleTime: STALE_TIME.conversations,
    refetchInterval: chatOpen ? POLLING.conversationsWhenChatOpen : POLLING.conversations,
    refetchOnWindowFocus: true,
  });
}
