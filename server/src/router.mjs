// Núcleo de roteamento, independente de transporte (HTTP local ou API Gateway/Lambda) e de
// armazenamento (memória ou DynamoDB). Recebe uma requisição normalizada + um "store".

import { randomUUID } from "node:crypto";
import { suggestReply } from "./ai.mjs";
import { agent } from "./seed.mjs";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PATCH,OPTIONS",
  "access-control-allow-headers": "content-type,x-seed-token",
};

const MAX_MESSAGE_LENGTH = 4096;

function ok(body, status = 200) {
  return { status, headers: { "content-type": "application/json", ...CORS }, body };
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

function sortMessagesAsc(list) {
  return [...list].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
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
    return ok(list);
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
      let list = sortMessagesAsc(await store.listMessages(convId));

      if (query.since) {
        const since = parseIso(query.since);
        if (!since) return err(400, "parâmetro since inválido");
        list = list.filter((message) => message.createdAt > since);
      }

      return ok(list);
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
