import { MessagesSquare } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

interface ChatPanelPlaceholderProps {
  conversationId: string;
}

export function ChatPanelPlaceholder({ conversationId }: ChatPanelPlaceholderProps) {
  return (
    <>
      <span className="sr-only">Conversa {conversationId}</span>
      <EmptyState
        icon={MessagesSquare}
        title="Conversa selecionada"
        description="O histórico e o envio de mensagens serão exibidos aqui em breve."
        className="h-full"
      />
    </>
  );
}
