# ENTREGA — Inbox WhatsApp (Next.js)

Documento de entrega com instruções de execução, decisões de arquitetura e trade-offs.

---

## Como rodar

```bash
# 1. Variáveis de ambiente
cp .env.example .env.local

# 2. Dependências e dev server
npm install
npm run dev          # http://localhost:3000 → redireciona para /inbox
```

A home (`/`) redireciona automaticamente para `/inbox`. Não há mais tela de ConnectionCheck na raiz.

### Backend local (opcional)

Para testar extensões de API (mark-as-read, delta, ETag, etc.):

```bash
cd server
npm install
npm run dev          # http://localhost:4000
```

Atualize `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Qualidade

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e    # Playwright — sobe dev server automaticamente
```

**E2E:** requer `.env.local` com API acessível. Instale browsers: `npx playwright install chromium`.

---

## Decisões de arquitetura

### Estado: React Query + URL + useState local

| Camada | Ferramenta | Responsabilidade |
|--------|------------|------------------|
| Server state | TanStack Query | Conversas, mensagens, perfil do agente |
| Navegação | URL (`/inbox`, `/inbox/[id]`, `?search=`) | Conversa ativa, busca |
| UI efêmera | `useState` no composer | Texto digitado, erros inline |

**Por que não Zustand/Redux?** Os dados vêm da API REST; React Query já resolve cache, deduplicação, refetch, optimistic updates e invalidação. A URL é a fonte de verdade para “qual conversa está aberta”. O único estado local relevante é o textarea — global store seria overhead sem benefício.

### Polling vs WebSocket

A API fornecida é REST sem WebSocket. Estratégia adotada:

| Recurso | Intervalo | Condição |
|---------|-----------|----------|
| Mensagens (chat ativo) | 4s | `refetchInterval` na query da conversa aberta |
| Lista de conversas | 8s | Inbox sem chat aberto |
| Lista com chat aberto | 15s | Menos agressivo — preview já atualiza no envio |
| Focus da aba | Refetch imediato | `refetchOnWindowFocus: true` |
| Aba em background | Pausado | `refetchIntervalInBackground: false` |

**Trade-off:** polling é simples e adequado ao desafio; em produção com escala, migraria para WebSocket/SSE ou long polling (implementado no backend local).

**Prefetch:** SSR no layout (conversas) + page (mensagens); hover na lista aquece cache antes do clique.

### Boundaries Server vs Client

| Componente | Tipo | Motivo |
|------------|------|--------|
| `app/(inbox)/inbox/layout.tsx` | Server | Prefetch SSR + `HydrationBoundary` |
| `[conversationId]/page.tsx` | Server | Prefetch mensagens |
| `InboxShell` | Server wrapper | Composição sem hooks |
| `InboxShellClient` | Client | Interatividade do shell |
| `ChatPanel`, `MessageList`, composer | Client | React Query hooks, scroll, mutations |
| `MessageBubble` | Server | Presentacional puro (sem hooks) |

Regra: `"use client"` só onde há estado, efeitos ou event handlers.

---

## Segurança (hardening aplicado)

- **Limite de mensagem:** 4096 caracteres (frontend `maxLength` + validação no server)
- **IDs de conversa:** padrão `c-\d+` — queries desabilitadas para IDs inválidos
- **Admin seed:** retorna 404 se `SEED_TOKEN` não configurado (não revela rota)
- **XSS:** mensagens renderizadas como texto React (sem `dangerouslySetInnerHTML`)
- **CORS `*`:** aceitável para API demo; documentado como risco em produção

---

## Troubleshooting (dev local)

### Erro `vendor-chunks/axios.js` ou `routes-manifest.json`

Causa comum: cache `.next` corrompido (ex.: `npm run build` + `npm run dev` simultâneos).

```bash
# 1. Pare o dev server (Ctrl+C)
# 2. Remova o cache
rm -rf .next          # Linux/macOS
Remove-Item -Recurse -Force .next   # PowerShell

# 3. Reinicie
npm run dev
```

**Evite** rodar `build` e `dev` ao mesmo tempo na mesma pasta.

---

## Checklist de responsividade (manual)

- [x] **Mobile (<768px):** lista full-screen; chat ocupa tela; botão voltar no header
- [x] **Tablet:** split view ou transição lista ↔ chat
- [x] **Desktop:** painel fixo lista + chat lado a lado
- [x] Touch targets ≥ 44px nos botões do composer (mobile)
- [x] Composer não quebra layout com teclado virtual

---

## O que faria com mais tempo

- WebSocket/SSE para mensagens em tempo real (substituir long polling)
- Testes E2E ampliados (rollback offline, conversa inválida, mark-as-read com refresh)
- Deploy das extensões de API (`PATCH read`, delta, ETag) na API hospedada AWS
- Autenticação e multi-tenant no backend

---

## Estrutura do projeto

```
app/(inbox)/inbox/     — rotas do inbox
features/
  conversations/       — lista, busca, queries
  messages/            — chat, envio, bolhas
  ai/                  — sugestão IA
  inbox/               — shell layout
lib/
  api.ts               — cliente HTTP
  config/polling.ts    — intervalos
  prefetch-inbox.ts    — SSR prefetch
```
