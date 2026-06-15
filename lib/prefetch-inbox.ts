import type { QueryClient } from "@tanstack/react-query";

import { conversationsQueryOptions } from "@/features/conversations/queries";
import { messagesQueryOptions } from "@/features/messages/queries";

export async function prefetchConversations(queryClient: QueryClient) {
  await queryClient.prefetchQuery(conversationsQueryOptions());
}

export async function prefetchConversationChat(
  queryClient: QueryClient,
  conversationId: string,
) {
  await Promise.all([
    queryClient.prefetchQuery(conversationsQueryOptions({ chatOpen: true })),
    queryClient.prefetchQuery(messagesQueryOptions(conversationId)),
  ]);
}
