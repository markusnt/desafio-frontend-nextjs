import { queryOptions } from "@tanstack/react-query";

import { getConversations } from "@/lib/api";
import { POLLING, STALE_TIME } from "@/lib/config/polling";

export const conversationKeys = {
  all: ["conversations"] as const,
  list: () => [...conversationKeys.all, "list"] as const,
};

interface ConversationsQueryOptions {
  chatOpen?: boolean;
}

export function conversationsQueryOptions(options: ConversationsQueryOptions = {}) {
  const { chatOpen = false } = options;

  return queryOptions({
    queryKey: conversationKeys.list(),
    queryFn: getConversations,
    staleTime: STALE_TIME.conversations,
    refetchInterval: chatOpen ? POLLING.conversationsWhenChatOpen : POLLING.conversations,
    refetchOnWindowFocus: true,
  });
}
