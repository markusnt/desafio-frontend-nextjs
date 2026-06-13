"use client";

import { useQuery } from "@tanstack/react-query";

import { agentQueryOptions } from "@/features/agent/queries";
import { conversationsQueryOptions } from "@/features/conversations/queries";

export function ConnectionCheck() {
  const me = useQuery(agentQueryOptions());
  const conversations = useQuery(conversationsQueryOptions());

  if (me.isLoading || conversations.isLoading) {
    return <p className="mt-2 text-sm text-muted-foreground">Conectando à API…</p>;
  }

  if (me.isError || conversations.isError) {
    return (
      <p className="mt-2 text-sm text-destructive">
        Não consegui conectar. Confira <code>NEXT_PUBLIC_API_URL</code> no seu{" "}
        <code>.env.local</code>.
      </p>
    );
  }

  return (
    <p className="mt-2 text-sm text-green-700">
      ✓ Conectado como <strong>{me.data?.name}</strong> — {conversations.data?.length}{" "}
      conversas carregadas.
    </p>
  );
}
