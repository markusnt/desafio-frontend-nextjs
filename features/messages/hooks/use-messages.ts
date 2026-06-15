"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

import { messagesQueryOptions } from "@/features/messages/queries";
import { LONG_POLL_FALLBACK_MS } from "@/lib/config/polling";

export function useMessages(conversationId: string) {
  const queryClient = useQueryClient();
  const query = useQuery(messagesQueryOptions(conversationId, queryClient));

  const refetchRef = useRef(query.refetch);
  refetchRef.current = query.refetch;

  const schedulePoll = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => {
      void refetchRef.current();
    }, LONG_POLL_FALLBACK_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!query.isSuccess || query.isFetching) {
      return;
    }

    return schedulePoll();
  }, [query.isSuccess, query.isFetching, query.dataUpdatedAt, schedulePoll]);

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
