"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { conversationsQueryOptions } from "@/features/conversations/queries";

export function useConversation(conversationId: string) {
  const params = useParams<{ conversationId?: string }>();
  const chatOpen = Boolean(params.conversationId);

  const query = useQuery({
    ...conversationsQueryOptions({ chatOpen }),
    select: (conversations) => conversations.find((item) => item.id === conversationId),
  });

  return {
    conversation: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
