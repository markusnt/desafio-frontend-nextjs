import { useQuery } from "@tanstack/react-query";

import { conversationsQueryOptions } from "@/features/conversations/queries";

export function useConversations() {
  const query = useQuery(conversationsQueryOptions());

  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
