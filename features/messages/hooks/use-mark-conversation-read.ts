"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useConversation } from "@/features/conversations/hooks/use-conversation";
import { markConversationReadInCache } from "@/features/messages/utils/mark-conversation-read";
import { isValidConversationId } from "@/lib/validation";

export function useMarkConversationRead(conversationId: string) {
  const queryClient = useQueryClient();
  const { conversation, isLoading } = useConversation(conversationId);

  useEffect(() => {
    if (!isValidConversationId(conversationId) || isLoading || !conversation) {
      return;
    }

    if (conversation.unread > 0) {
      markConversationReadInCache(queryClient, conversationId);
    }
  }, [conversation, conversationId, isLoading, queryClient]);
}
