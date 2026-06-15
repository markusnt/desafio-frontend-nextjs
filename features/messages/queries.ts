import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { mergeMessages } from "@/features/messages/utils/merge-messages";
import { getMessages } from "@/lib/api";
import type { Message } from "@/lib/api";
import { POLLING, STALE_TIME } from "@/lib/config/polling";
import { isValidConversationId } from "@/lib/validation";

export const messageKeys = {
  all: ["messages"] as const,
  byConversation: (conversationId: string) =>
    [...messageKeys.all, conversationId] as const,
};

const LONG_POLL_WAIT_SECONDS = 25;

function createLiveMessagesQueryFn(conversationId: string, queryClient: QueryClient) {
  return async (): Promise<Message[]> => {
    const existing = queryClient.getQueryData<Message[]>(
      messageKeys.byConversation(conversationId),
    );
    const latestTimestamp = existing?.at(-1)?.createdAt;
    const hasHistory = Boolean(existing?.length);

    const incoming = await getMessages(conversationId, {
      since: hasHistory ? latestTimestamp : undefined,
      wait: hasHistory && typeof window !== "undefined" ? LONG_POLL_WAIT_SECONDS : undefined,
    });

    if (!hasHistory) {
      return incoming;
    }

    if (incoming.length === 0) {
      return existing ?? [];
    }

    return mergeMessages(existing, incoming);
  };
}

export function messagesQueryOptions(conversationId: string, queryClient?: QueryClient) {
  return queryOptions({
    queryKey: messageKeys.byConversation(conversationId),
    queryFn: queryClient
      ? createLiveMessagesQueryFn(conversationId, queryClient)
      : () => getMessages(conversationId),
    enabled: isValidConversationId(conversationId),
    staleTime: STALE_TIME.messages,
    refetchInterval: queryClient ? false : POLLING.messages,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });
}

export { mergeMessages };
