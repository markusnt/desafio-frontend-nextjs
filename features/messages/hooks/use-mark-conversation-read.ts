"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { useConversation } from "@/features/conversations/hooks/use-conversation";
import { markConversationReadInCache } from "@/features/messages/utils/mark-conversation-read";
import { markConversationRead } from "@/lib/api";
import { isValidConversationId } from "@/lib/validation";

export function useMarkConversationRead(conversationId: string) {
  const queryClient = useQueryClient();
  const { conversation, isLoading } = useConversation(conversationId);
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isValidConversationId(conversationId) || isLoading || !conversation) {
      return;
    }

    if (conversation.unread <= 0) {
      return;
    }

    markConversationReadInCache(queryClient, conversationId);

    if (syncedRef.current === conversationId) {
      return;
    }

    syncedRef.current = conversationId;

    markConversationRead(conversationId)
      .then((result) => {
        if (result) {
          markConversationReadInCache(queryClient, conversationId);
        }
      })
      .catch(() => {
        syncedRef.current = null;
      });
  }, [conversation, conversationId, isLoading, queryClient]);
}
