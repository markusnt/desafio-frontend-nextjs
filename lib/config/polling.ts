export const POLLING = {
  conversations: 8_000,
  conversationsWhenChatOpen: 15_000,
  messages: 4_000,
} as const;

/** Fallback quando long poll (wait=25) retorna sem novas mensagens. */
export const LONG_POLL_FALLBACK_MS = 26_000;

export const STALE_TIME = {
  conversations: 5_000,
  messages: 3_000,
  agent: 60_000,
} as const;
