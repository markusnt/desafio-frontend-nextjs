import type { QueryClient } from "@tanstack/react-query";

import { conversationsQueryOptions } from "@/features/conversations/queries";
import { messagesQueryOptions } from "@/features/messages/queries";
import { isValidConversationId } from "@/lib/validation";

function logPrefetchError(label: string, error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[prefetch] ${label}:`, error);
  }
}

export async function prefetchConversations(queryClient: QueryClient) {
  try {
    await queryClient.prefetchQuery(conversationsQueryOptions());
  } catch (error) {
    logPrefetchError("conversations", error);
  }
}

export async function prefetchConversationChat(
  queryClient: QueryClient,
  conversationId: string,
) {
  try {
    await Promise.all([
      queryClient.prefetchQuery(conversationsQueryOptions({ chatOpen: true })),
      isValidConversationId(conversationId)
        ? queryClient.prefetchQuery(messagesQueryOptions(conversationId))
        : Promise.resolve(),
    ]);
  } catch (error) {
    logPrefetchError(`chat:${conversationId}`, error);
  }
}
