import { Skeleton } from "@/components/ui/skeleton";

export function ConversationSidebar() {
  return (
    <aside className="flex h-full flex-col bg-background">
      <div className="border-b p-3">
        <h2 className="text-sm font-semibold">Conversas</h2>
      </div>

      <div className="flex flex-col gap-1 p-2" aria-hidden>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-lg p-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 w-2/5" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-3 w-8 shrink-0" />
          </div>
        ))}
      </div>
    </aside>
  );
}
