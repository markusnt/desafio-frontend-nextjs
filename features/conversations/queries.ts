import { queryOptions } from "@tanstack/react-query";

import { getConversations } from "@/lib/api";

export const conversationKeys = {
  all: ["conversations"] as const,
  list: () => [...conversationKeys.all, "list"] as const,
};

export const CONVERSATIONS_POLL_INTERVAL = 8_000;

export function conversationsQueryOptions() {
  return queryOptions({
    queryKey: conversationKeys.list(),
    queryFn: getConversations,
    staleTime: 5_000,
    refetchInterval: CONVERSATIONS_POLL_INTERVAL,
  });
}
