# Inbox de Atendimento WhatsApp — Next.js

Painel de atendimento via WhatsApp com sugestão de resposta por IA. Frontend Next.js (App Router) consumindo API REST.

> **Documentação completa de entrega:** [`ENTREGA.md`](ENTREGA.md) — decisões de arquitetura, polling, boundaries Server/Client e troubleshooting.

---

## Início rápido

```bash
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

A rota `/` redireciona para `/inbox`. Abra uma conversa na lista para ver o chat.

**API padrão** (hospedada):

```
NEXT_PUBLIC_API_URL=https://8tymn68hp9.execute-api.us-east-1.amazonaws.com
```

Para backend local com extensões (mark-as-read, delta, etc.), veja [`server/README.md`](server/README.md) e [`ENTREGA.md`](ENTREGA.md).

---

## Funcionalidades

- Lista de conversas com busca (`?search=`), badge de não-lidas e polling adaptativo
- Chat com histórico, bolhas in/out, envio otimista e sugestão IA
- Prefetch SSR + hover; mark-read local ao abrir conversa
- Estados loading/erro/vazio; acessibilidade (`aria-live`, landmarks)
- Layout responsivo (mobile / desktop)

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run typecheck` | Verificação TypeScript |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Testes E2E (Playwright) |

---

## Estrutura

Organização **feature-based**: `features/conversations`, `features/messages`, `features/ai`, `features/inbox`.

Cliente HTTP e tipos em [`lib/api.ts`](lib/api.ts).

---

## Critérios de avaliação

| Critério | Peso |
|----------|------|
| Arquitetura de componentes | 25% |
| Data fetching & estado | 25% |
| UX & estados | 20% |
| Qualidade do código | 20% |
| Capricho & detalhes | 10% |

Detalhes e auto-avaliação em [`CHECKLIST.md`](CHECKLIST.md) e [`GAPS-CHECKLIST.md`](GAPS-CHECKLIST.md).
