import axios from "axios";

/**
 * Cliente da API. Aponta para NEXT_PUBLIC_API_URL (veja .env.example).
 *
 * Rotas base:
 *   GET  /me
 *   GET  /conversations
 *   GET  /conversations/:id/messages
 *   POST /conversations/:id/messages   { text }
 *   POST /ai/suggest                   { conversationId }
 *
 * Extensões (backend local / deploy atualizado):
 *   PATCH /conversations/:id/read
 *   GET   /conversations/:id/messages?since=&before=&limit=&wait=
 *   GET   /conversations + If-None-Match → 304
 */

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  timeout: 20_000,
});

// ─── Tipos ────────────────────────────────────────────────
export interface Conversation {
  id: string;
  contactName: string;
  contactPhone: string;
  avatarColor: string;
  unread: number;
  lastMessage: string;
  lastMessageAt: string;
}

export interface Message {
  id: string;
  direction: "in" | "out";
  body: string;
  status: "sent" | "delivered" | "read";
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
}

export interface AiSuggestion {
  suggestion: string;
  source: "openai" | "mock" | "mock-fallback";
}

export interface GetMessagesOptions {
  since?: string;
  before?: string;
  limit?: number;
  wait?: number;
}

export interface MarkConversationReadResult {
  id: string;
  unread: number;
}

// ─── Funções ──────────────────────────────────────────────
export async function getMe(): Promise<Agent> {
  const { data } = await api.get<Agent>("/me");
  return data;
}

export async function getConversations(ifNoneMatch?: string): Promise<{
  data: Conversation[];
  etag?: string;
  notModified: boolean;
}> {
  const response = await api.get<Conversation[]>("/conversations", {
    headers: ifNoneMatch ? { "If-None-Match": ifNoneMatch } : undefined,
    validateStatus: (status) => status === 200 || status === 304,
  });

  const etag = response.headers.etag as string | undefined;

  if (response.status === 304) {
    return { data: [], etag: ifNoneMatch ?? etag, notModified: true };
  }

  return { data: response.data, etag, notModified: false };
}

export async function getMessages(
  conversationId: string,
  options: GetMessagesOptions = {},
): Promise<Message[]> {
  const { wait, ...params } = options;
  const timeout = wait ? (wait + 5) * 1000 : 20_000;

  const { data } = await api.get<Message[]>(`/conversations/${conversationId}/messages`, {
    params: {
      ...params,
      wait: wait || undefined,
    },
    timeout,
  });

  return data;
}

export async function markConversationRead(
  conversationId: string,
): Promise<MarkConversationReadResult | null> {
  try {
    const { data } = await api.patch<MarkConversationReadResult>(
      `/conversations/${conversationId}/read`,
    );
    return data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 404 || error.response?.status === 405)
    ) {
      return null;
    }
    throw error;
  }
}

export async function sendMessage(conversationId: string, text: string): Promise<Message> {
  const { data } = await api.post<Message>(`/conversations/${conversationId}/messages`, { text });
  return data;
}

export async function suggestReply(conversationId: string): Promise<AiSuggestion> {
  const { data } = await api.post<AiSuggestion>("/ai/suggest", { conversationId });
  return data;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const { data } = await api.get<{ ok: boolean }>("/health", { timeout: 5_000 });
    return Boolean(data.ok);
  } catch {
    return false;
  }
}
