import type { Conversation } from "@/lib/api";

export function filterConversations(
  conversations: Conversation[],
  search: string,
): Conversation[] {
  const term = search.trim().toLowerCase();

  if (!term) {
    return conversations;
  }

  return conversations.filter(
    (conversation) =>
      conversation.contactName.toLowerCase().includes(term) ||
      conversation.contactPhone.includes(term) ||
      conversation.lastMessage.toLowerCase().includes(term),
  );
}
