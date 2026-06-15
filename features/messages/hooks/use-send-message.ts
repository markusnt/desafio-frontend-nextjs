"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { conversationKeys } from "@/features/conversations/queries";
import { messageKeys } from "@/features/messages/queries";
import { updateConversationPreview } from "@/features/messages/utils/update-conversation-preview";
import { sendMessage, type Conversation, type Message } from "@/lib/api";

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
      const previousConversations = queryClient.getQueryData<Conversation[]>(
        conversationKeys.list(),
      );
      const optimisticMessage = createOptimisticMessage(text);
      const now = optimisticMessage.createdAt;

      queryClient.setQueryData<Message[]>(messagesKey, (current) => [
        ...(current ?? []),
        optimisticMessage,
      ]);

      updateConversationPreview(queryClient, conversationId, text, now);

      return { previousMessages, previousConversations };
    },
    onError: (_error, _text, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          messageKeys.byConversation(conversationId),
          context.previousMessages,
        );
      }

      if (context?.previousConversations) {
        queryClient.setQueryData(conversationKeys.list(), context.previousConversations);
      }
    },
    onSuccess: (realMessage) => {
      queryClient.setQueryData<Message[]>(
        messageKeys.byConversation(conversationId),
        (current) => {
          const withoutOptimistic = (current ?? []).filter(
            (message) => !message.id.startsWith("optimistic-"),
          );

          if (withoutOptimistic.some((message) => message.id === realMessage.id)) {
            return withoutOptimistic;
          }

          return [...withoutOptimistic, realMessage];
        },
      );
    },
    onSettled: (_data, error) => {
      if (error) {
        queryClient.invalidateQueries({ queryKey: messageKeys.byConversation(conversationId) });
        queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
      }
    },
  });
}
