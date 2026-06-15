import { queryOptions } from "@tanstack/react-query";

import {
  getConversationsEtag,
  getConversationsSnapshot,
  setConversationsSnapshot,
} from "@/lib/conversations-cache";
import { getConversations } from "@/lib/api";
import { POLLING, STALE_TIME } from "@/lib/config/polling";

export const conversationKeys = {
  all: ["conversations"] as const,
  list: () => [...conversationKeys.all, "list"] as const,
};

interface ConversationsQueryOptions {
  chatOpen?: boolean;
}

export function conversationsQueryOptions(options: ConversationsQueryOptions = {}) {
  const { chatOpen = false } = options;

  return queryOptions({
    queryKey: conversationKeys.list(),
    queryFn: async () => {
      const result = await getConversations(getConversationsEtag());

      if (result.notModified) {
        const cached = getConversationsSnapshot();
        if (cached) {
          return cached;
        }
      }

      setConversationsSnapshot(result.data, result.etag);
      return result.data;
    },
    staleTime: STALE_TIME.conversations,
    refetchInterval: chatOpen ? POLLING.conversationsWhenChatOpen : POLLING.conversations,
    refetchOnWindowFocus: true,
  });
}
