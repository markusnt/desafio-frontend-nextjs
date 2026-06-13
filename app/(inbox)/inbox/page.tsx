import { MessageSquareDashed } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";

export default function InboxPage() {
  return (
    <EmptyState
      icon={MessageSquareDashed}
      title="Selecione uma conversa"
      description="Escolha um contato na lista ao lado para visualizar o histórico e responder."
      className="h-full"
    />
  );
}
