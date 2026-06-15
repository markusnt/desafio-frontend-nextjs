// Núcleo de roteamento, independente de transporte (HTTP local ou API Gateway/Lambda) e de
// armazenamento (memória ou DynamoDB). Recebe uma requisição normalizada + um "store".

import { randomUUID } from "node:crypto";
import { suggestReply } from "./ai.mjs";
import { agent } from "./seed.mjs";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PATCH,OPTIONS",
  "access-control-allow-headers": "content-type,if-none-match,x-seed-token",
};

const MAX_MESSAGE_LENGTH = 4096;
const MAX_PAGE_LIMIT = 100;
const DEFAULT_PAGE_LIMIT = 50;
const MAX_WAIT_SECONDS = 30;

function ok(body, status = 200, extraHeaders = {}) {
  return {
    status,
    headers: { "content-type": "application/json", ...CORS, ...extraHeaders },
    body,
  };
}

function okNoBody(status = 204, extraHeaders = {}) {
  return { status, headers: { ...CORS, ...extraHeaders }, body: "" };
}

function err(status, message) {
  return ok({ error: message }, status);
}

function parseIso(value) {
  if (!value) return null;
  const date = new Date(value.toString());
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function clampInt(value, defaultValue, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (Number.isNaN(parsed) || parsed < 1) return defaultValue;
  return Math.min(parsed, max);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sortMessagesAsc(list) {
  return [...list].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
}

function computeConversationsEtag(list) {
  const maxLastMessageAt = list.reduce(
    (acc, conversation) => (conversation.lastMessageAt > acc ? conversation.lastMessageAt : acc),
    "",
  );
  const unreadTotal = list.reduce((acc, conversation) => acc + (conversation.unread ?? 0), 0);
  return `"${list.length}-${maxLastMessageAt}-${unreadTotal}"`;
}

async function resolveMessages(store, convId, query) {
  let list = sortMessagesAsc(await store.listMessages(convId));

  if (query.since) {
    const since = parseIso(query.since);
    if (!since) return { error: err(400, "parâmetro since inválido") };
    list = list.filter((message) => message.createdAt > since);
  }

  if (query.before) {
    const before = parseIso(query.before);
    if (!before) return { error: err(400, "parâmetro before inválido") };
    list = list.filter((message) => message.createdAt < before);
  }

  if (query.before || query.limit) {
    const limit = clampInt(query.limit, DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT);
    list = list.slice(-limit);
  }

  return { list };
}

async function resolveMessagesWithWait(store, convId, query) {
  const waitSeconds = clampInt(query.wait, 0, MAX_WAIT_SECONDS);
  if (waitSeconds === 0) {
    return resolveMessages(store, convId, query);
  }

  const since = query.since ? parseIso(query.since) : null;
  if (query.since && !since) return { error: err(400, "parâmetro since inválido") };

  const deadline = Date.now() + waitSeconds * 1000;
  let baselineCount = since
    ? (await store.listMessages(convId)).filter((message) => message.createdAt > since).length
    : (await store.listMessages(convId)).length;

  while (Date.now() < deadline) {
    const current = sortMessagesAsc(await store.listMessages(convId));
    const matching = since
      ? current.filter((message) => message.createdAt > since)
      : current;

    if (matching.length > baselineCount) {
      return resolveMessages(store, convId, query);
    }

    await sleep(500);
  }

  return resolveMessages(store, convId, query);
}

/**
 * @param {{method:string, path:string, query:object, body:any, headers:object}} req
 * @param {object} store
 */
export async function handle(req, store) {
  const { method, path, query } = req;
  const headers = Object.fromEntries(
    Object.entries(req.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value]),
  );

  if (method === "OPTIONS") return { status: 204, headers: CORS, body: "" };
  if (method === "GET" && path === "/health") return ok({ ok: true });
  if (method === "GET" && path === "/me") return ok(agent);

  if (method === "GET" && path === "/conversations") {
    const list = await store.listConversations();
    list.sort((a, b) => (a.lastMessageAt < b.lastMessageAt ? 1 : -1));
    const etag = computeConversationsEtag(list);
    const ifNoneMatch = headers["if-none-match"];

    if (ifNoneMatch && ifNoneMatch === etag) {
      return okNoBody(304, { etag });
    }

    return ok(list, 200, { etag });
  }

  const readMatch = path.match(/^\/conversations\/([^/]+)\/read$/);
  if (readMatch && method === "PATCH") {
    const convId = readMatch[1];
    const conv = await store.getConversation(convId);
    if (!conv) return err(404, "conversa não encontrada");
    await store.markConversationRead(convId);
    return ok({ id: convId, unread: 0 });
  }

  const msgMatch = path.match(/^\/conversations\/([^/]+)\/messages$/);
  if (msgMatch) {
    const convId = msgMatch[1];
    const conv = await store.getConversation(convId);
    if (!conv) return err(404, "conversa não encontrada");

    if (method === "GET") {
      const result = await resolveMessagesWithWait(store, convId, query);
      if (result.error) return result.error;
      return ok(result.list);
    }

    if (method === "POST") {
      const text = req.body?.text?.toString().trim();
      if (!text) return err(400, "campo obrigatório: text");
      if (text.length > MAX_MESSAGE_LENGTH) {
        return err(400, `mensagem excede o limite de ${MAX_MESSAGE_LENGTH} caracteres`);
      }
      const now = new Date().toISOString();
      const message = {
        id: `m-${randomUUID().slice(0, 8)}`,
        direction: "out",
        body: text,
        status: "sent",
        createdAt: now,
      };
      await store.addMessage(convId, message);
      await store.updateConversation(convId, { lastMessage: text, lastMessageAt: now, unread: 0 });
      return ok(message, 201);
    }
  }

  if (method === "POST" && path === "/ai/suggest") {
    const convId = req.body?.conversationId;
    if (!convId) return err(400, "campo obrigatório: conversationId");
    const conv = await store.getConversation(convId);
    if (!conv) return err(404, "conversa não encontrada");
    const history = sortMessagesAsc(await store.listMessages(convId));
    const result = await suggestReply({ contactName: conv.contactName, history });
    return ok(result);
  }

  if (method === "POST" && path === "/admin/seed") {
    if (!process.env.SEED_TOKEN) return err(404, "rota não encontrada");
    const token = headers["x-seed-token"];
    if (!token || token !== process.env.SEED_TOKEN) return err(401, "token inválido");
    const count = await store.seed();
    return ok({ seeded: true, ...count });
  }

  return err(404, "rota não encontrada");
}
