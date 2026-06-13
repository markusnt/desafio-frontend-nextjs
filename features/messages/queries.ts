import { queryOptions } from "@tanstack/react-query";

import { getMessages } from "@/lib/api";

export const messageKeys = {
  all: ["messages"] as const,
  byConversation: (conversationId: string) =>
    [...messageKeys.all, conversationId] as const,
};

export const MESSAGES_POLL_INTERVAL = 4_000;

export function messagesQueryOptions(conversationId: string) {
  return queryOptions({
    queryKey: messageKeys.byConversation(conversationId),
    queryFn: () => getMessages(conversationId),
    enabled: Boolean(conversationId),
    staleTime: 3_000,
    refetchInterval: MESSAGES_POLL_INTERVAL,
  });
}
