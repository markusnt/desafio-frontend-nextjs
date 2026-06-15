"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { conversationKeys } from "@/features/conversations/queries";
import { messageKeys } from "@/features/messages/queries";
import { updateConversationPreview } from "@/features/messages/utils/update-conversation-preview";
import { sendMessage, type Message } from "@/lib/api";

function createOptimisticMessage(text: string): Message {
  return {
    id: `optimistic-${crypto.randomUUID()}`,
    direction: "out",
    body: text,
    status: "sent",
    createdAt: new Date().toISOString(),
  };
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => sendMessage(conversationId, text),
    onMutate: async (text) => {
      const messagesKey = messageKeys.byConversation(conversationId);

      await queryClient.cancelQueries({ queryKey: messagesKey });

      const previousMessages = queryClient.getQueryData<Message[]>(messagesKey);
      const optimisticMessage = createOptimisticMessage(text);
      const now = optimisticMessage.createdAt;

      queryClient.setQueryData<Message[]>(messagesKey, (current) => [
        ...(current ?? []),
        optimisticMessage,
      ]);

      updateConversationPreview(queryClient, conversationId, text, now);

      return { previousMessages };
    },
    onError: (_error, _text, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          messageKeys.byConversation(conversationId),
          context.previousMessages,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.byConversation(conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });
}
