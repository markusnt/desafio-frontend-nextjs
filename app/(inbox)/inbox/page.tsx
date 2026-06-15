import { MessageSquareDashed } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export default function InboxPage() {
  return (
    <EmptyState
      icon={MessageSquareDashed}
      title="Selecione uma conversa"
      description={
        <>
          <span className="md:hidden">
            Escolha um contato na lista para visualizar o histórico e responder.
          </span>
          <span className="hidden md:inline">
            Escolha um contato na lista ao lado para visualizar o histórico e responder.
          </span>
        </>
      }
      className="h-full px-6"
    />
  );
}
