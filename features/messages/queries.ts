import { queryOptions } from "@tanstack/react-query";

import { getMessages } from "@/lib/api";
import { POLLING, STALE_TIME } from "@/lib/config/polling";

export const messageKeys = {
  all: ["messages"] as const,
  byConversation: (conversationId: string) =>
    [...messageKeys.all, conversationId] as const,
};

export function messagesQueryOptions(conversationId: string) {
  return queryOptions({
    queryKey: messageKeys.byConversation(conversationId),
    queryFn: () => getMessages(conversationId),
    enabled: Boolean(conversationId),
    staleTime: STALE_TIME.messages,
    refetchInterval: POLLING.messages,
  });
}
