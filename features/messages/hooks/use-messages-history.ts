"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  flattenMessagePages,
  messagesHistoryInfiniteOptions,
} from "@/features/messages/queries";

export function useMessagesHistory(conversationId: string) {
  const query = useInfiniteQuery({
    ...messagesHistoryInfiniteOptions(conversationId),
    select: (data) => flattenMessagePages(data.pages),
  });

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
    isFetchingPreviousPage: query.isFetchingPreviousPage,
    hasPreviousPage: query.hasPreviousPage,
    fetchPreviousPage: query.fetchPreviousPage,
    isError: query.isError,
    refetch: query.refetch,
  };
}
