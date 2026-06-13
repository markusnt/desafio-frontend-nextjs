import { useQuery } from "@tanstack/react-query";

import { messagesQueryOptions } from "@/features/messages/queries";

export function useMessages(conversationId: string) {
  const query = useQuery(messagesQueryOptions(conversationId));

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
