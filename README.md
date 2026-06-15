# Desafio Técnico — Inbox de Atendimento WhatsApp (Next.js)

Painel de atendimento via WhatsApp com sugestão de resposta por IA. Frontend **Next.js (App Router)** consumindo a API REST fornecida.

---

## Como rodar

```bash
# 1. Configure a URL da API (já vem preenchida no .env.example)
cp .env.example .env.local

# 2. Instale e rode
npm install
npm run dev          # http://localhost:3000
```

Abra <http://localhost:3000> — a rota `/` redireciona para `/inbox`. O layout exibe um toast de conexão com a API na primeira visita.

### API padrão (hospedada)

```
NEXT_PUBLIC_API_URL=https://8tymn68hp9.execute-api.us-east-1.amazonaws.com
```

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/me` | Perfil do atendente |
| GET | `/conversations` | Lista de conversas |
| GET | `/conversations/:id/messages` | Mensagens da conversa |
| POST | `/conversations/:id/messages` | Envia mensagem `{ text }` |
| POST | `/ai/suggest` | Sugestão IA `{ conversationId }` |

Cliente HTTP e tipos em [`lib/api.ts`](lib/api.ts).

### Backend local (opcional)

Para extensões extras (mark-as-read, delta de mensagens, ETag), veja [`server/README.md`](server/README.md).

```bash
cd server && npm install && npm run dev 
```

Atualize `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:4000`

### Qualidade

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e    # Playwright — instale: npx playwright install chromium
```

---

## Funcionalidades entregues

1. **Lista de conversas** — contato, última mensagem, horário, badge de não-lidas, busca (`?search=`).
2. **Chat** — bolhas in/out, timestamps, separadores de data, status de entrega nas mensagens enviadas.
3. **Envio otimista** — mensagem aparece antes da confirmação; rollback em caso de erro.
4. **Sugestão IA** — botão chama `/ai/suggest` e preenche o composer (chave OpenAI só no backend).
5. **Estados** — loading, erro e vazio; `aria-live`, landmarks, layout responsivo.
6. **Atualização** — polling adaptativo com React Query; prefetch SSR e no hover da lista.

---

## Decisões de arquitetura

### Estado: React Query + URL + useState local

| Camada | Ferramenta | Responsabilidade |
|--------|------------|------------------|
| Server state | TanStack Query | Conversas, mensagens, perfil do agente |
| Navegação | URL (`/inbox`, `/inbox/[id]`, `?search=`) | Conversa ativa, filtro de busca |
| UI efêmera | `useState` no composer | Texto digitado, erros inline |

**Por que não Zustand/Redux?** Os dados vêm da API REST. React Query resolve cache, deduplicação, refetch, optimistic updates e invalidação. A URL define qual conversa está aberta. O único estado local relevante é o textarea — store global seria overhead sem benefício.

### Polling vs WebSocket

A API fornecida é REST, sem WebSocket. Estratégia adotada:

| Recurso | Intervalo | Condição |
|---------|-----------|----------|
| Mensagens (chat ativo) | ~4s | Query da conversa aberta (+ long poll no backend local) |
| Lista de conversas | 8s | Inbox sem chat aberto |
| Lista com chat aberto | 15s | Preview já atualiza no envio |
| Focus da aba | Refetch imediato | `refetchOnWindowFocus` |
| Aba em background | Pausado | `refetchIntervalInBackground: false` |

**Trade-off:** polling é simples e adequado ao desafio. Em produção, migraria para WebSocket/SSE. Extensões no `server/` local (long poll, delta) têm fallback gracioso na API hospedada.

**Prefetch:** SSR no layout (conversas) + page (mensagens); hover na lista aquece o cache antes do clique.

### Server vs Client Components

| Componente | Tipo | Motivo |
|------------|------|--------|
| `inbox/layout.tsx` | Server | Prefetch SSR + `HydrationBoundary` |
| `[conversationId]/page.tsx` | Server | Prefetch de mensagens |
| `InboxShell` | Server | Composição sem hooks |
| `InboxShellClient`, `ChatPanel`, composer | Client | Interatividade, React Query, mutations |
| `MessageBubble` | Server | Presentacional puro |

Regra: `"use client"` apenas onde há estado, efeitos ou event handlers.

### Organização do código

```
app/(inbox)/inbox/     — rotas do inbox
features/
  conversations/       — lista, busca, queries
  messages/            — chat, envio, bolhas
  ai/                  — sugestão IA
  inbox/               — shell e layout
lib/
  api.ts               — cliente HTTP
  config/polling.ts    — intervalos
  prefetch-inbox.ts    — prefetch SSR
```

---

## O que faria com mais tempo

- WebSocket/SSE para mensagens em tempo real (substituir polling).
- Deploy das extensões de API (mark-as-read, delta, ETag) na API hospedada AWS.
- Testes E2E ampliados (rollback offline, conversa inválida, mark-as-read com refresh).
- Autenticação e multi-tenant no backend.
- Mover cache ETag de conversas para dentro do React Query (evitar estado global no SSR).

---

## Troubleshooting

### Erro `vendor-chunks/axios.js` ou `routes-manifest.json`

Cache `.next` corrompido — comum ao rodar `build` e `dev` simultaneamente.

```bash
# Pare o dev server (Ctrl+C), remova o cache e reinicie
Remove-Item -Recurse -Force .next   # PowerShell
# rm -rf .next                      # Linux/macOS
npm run dev
```

**Evite** rodar `npm run build` e `npm run dev` na mesma pasta ao mesmo tempo.

### API indisponível

Verifique `NEXT_PUBLIC_API_URL` em `.env.local`. O componente `ConnectionCheck` no layout exibe toast de erro se `/health` falhar.

---

## Critérios de avaliação (auto-check)

| Critério | Peso | Nota | Destaques |
|----------|------|------|-----------|
| Arquitetura de componentes | 25% | Feature-based, Server/Client documentado, `HydrationBoundary` único |
| Data fetching & estado | 25% | React Query, optimistic update, rollback, mark-read, prefetch |
| UX & estados | 20% |  Loading/erro/vazio, 404, responsivo, `aria-live` |
| Qualidade do código | 20% | TypeScript, typecheck/lint/build/E2E ok |
| Capricho & detalhes | 10% | Status nas bolhas, separadores de data, virtualização, IA |

---

## Stack

Next.js 15 (App Router) · TypeScript · TanStack Query · Axios · Tailwind CSS · shadcn/ui · Playwright (E2E)
