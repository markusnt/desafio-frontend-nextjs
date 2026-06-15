import type { QueryClient } from "@tanstack/react-query";

import { conversationKeys } from "@/features/conversations/queries";
import type { Conversation } from "@/lib/api";

export function updateConversationPreview(
  queryClient: QueryClient,
  conversationId: string,
  lastMessage: string,
  lastMessageAt: string,
) {
  queryClient.setQueryData<Conversation[]>(conversationKeys.list(), (current) =>
    current?.map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, lastMessage, lastMessageAt, unread: 0 }
        : conversation,
    ),
  );
}
