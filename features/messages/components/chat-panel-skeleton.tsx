import { Skeleton } from "@/components/ui/skeleton";
import { MessageListSkeleton } from "@/features/messages/components/message-list-skeleton";

function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3" aria-hidden>
      <Skeleton className="size-10 shrink-0 rounded-full md:hidden" />
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

function ComposerSkeleton() {
  return (
    <div className="shrink-0 border-t border-border/60 px-4 py-3 md:px-5" aria-hidden>
      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>
  );
}

export function ChatPanelSkeleton() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Carregando conversa"
    >
      <span className="sr-only">Carregando conversa…</span>
      <header className="shrink-0 border-b border-border/60 bg-background/90">
        <ChatHeaderSkeleton />
      </header>
      <MessageListSkeleton />
      <ComposerSkeleton />
    </div>
  );
}
