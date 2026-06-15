import type { QueryClient } from "@tanstack/react-query";

import { conversationKeys } from "@/features/conversations/queries";
import type { Conversation } from "@/lib/api";

export function markConversationReadInCache(queryClient: QueryClient, conversationId: string) {
  queryClient.setQueryData<Conversation[]>(conversationKeys.list(), (current) =>
    current?.map((conversation) =>
      conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation,
    ),
  );
}
