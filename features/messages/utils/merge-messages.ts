import type { Message } from "@/lib/api";

export function mergeMessages(existing: Message[] | undefined, incoming: Message[]): Message[] {
  const map = new Map<string, Message>();

  for (const message of existing ?? []) {
    map.set(message.id, message);
  }

  for (const message of incoming) {
    map.set(message.id, message);
  }

  return [...map.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
