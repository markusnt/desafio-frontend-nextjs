import { Skeleton } from "@/components/ui/skeleton";

export function ConversationListSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-2 pb-2" aria-hidden>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-3"
        >
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}
