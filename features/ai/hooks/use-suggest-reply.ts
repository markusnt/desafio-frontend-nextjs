"use client";

import { useMutation } from "@tanstack/react-query";

import { suggestReply } from "@/lib/api";

export function useSuggestReply(conversationId: string) {
  return useMutation({
    mutationFn: () => suggestReply(conversationId),
  });
}
