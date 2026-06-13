import { queryOptions } from "@tanstack/react-query";

import { getConversations } from "@/lib/api";
import { POLLING, STALE_TIME } from "@/lib/config/polling";

export const conversationKeys = {
  all: ["conversations"] as const,
  list: () => [...conversationKeys.all, "list"] as const,
};

export function conversationsQueryOptions() {
  return queryOptions({
    queryKey: conversationKeys.list(),
    queryFn: getConversations,
    staleTime: STALE_TIME.conversations,
    refetchInterval: POLLING.conversations,
  });
}
