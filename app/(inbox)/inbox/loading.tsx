import { MessageSquareDashed } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function InboxLoading() {
  return (
    <div className="flex h-full flex-col" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Carregando inbox…</span>
      <EmptyState
        icon={MessageSquareDashed}
        title="Selecione uma conversa"
        description="Carregando painel de atendimento…"
        className="hidden h-full md:flex"
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 md:hidden">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
    </div>
  );
}
