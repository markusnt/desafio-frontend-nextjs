export const POLLING = {
  conversations: 8_000,
  conversationsWhenChatOpen: 15_000,
  messages: 4_000,
} as const;

export const STALE_TIME = {
  conversations: 5_000,
  messages: 3_000,
  agent: 60_000,
} as const;
