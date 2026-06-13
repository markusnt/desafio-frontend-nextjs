"use client";

import { MessagesSquare } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export function ChatPanelPlaceholder() {
  return (
    <EmptyState
      icon={MessagesSquare}
      title="Conversa selecionada"
      description="O histórico e o envio de mensagens serão exibidos aqui em breve."
      className="h-full"
    />
  );
}
