import { infiniteQueryOptions, keepPreviousData, queryOptions } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { mergeMessages, flattenMessagePages } from "@/features/messages/utils/merge-messages";
import { getMessages } from "@/lib/api";
import type { Message } from "@/lib/api";
import { POLLING, STALE_TIME } from "@/lib/config/polling";
import { isValidConversationId } from "@/lib/validation";

export const messageKeys = {
  all: ["messages"] as const,
  byConversation: (conversationId: string) =>
    [...messageKeys.all, conversationId] as const,
  history: (conversationId: string) =>
    [...messageKeys.byConversation(conversationId), "history"] as const,
};

const LONG_POLL_WAIT_SECONDS = 25;
const HISTORY_PAGE_SIZE = 50;

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

export function messagesHistoryInfiniteOptions(conversationId: string) {
  return infiniteQueryOptions({
    queryKey: messageKeys.history(conversationId),
    enabled: isValidConversationId(conversationId),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      if (!pageParam) {
        return getMessages(conversationId);
      }

      return getMessages(conversationId, {
        before: pageParam,
        limit: HISTORY_PAGE_SIZE,
      });
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.length < HISTORY_PAGE_SIZE) {
        return undefined;
      }

      return firstPage[0]?.createdAt;
    },
    getNextPageParam: () => undefined,
  });
}

export { flattenMessagePages, mergeMessages };
