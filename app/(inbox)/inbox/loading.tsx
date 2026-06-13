import { Skeleton } from "@/components/ui/skeleton";

export default function InboxLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="mx-auto size-12 rounded-full" />
          <Skeleton className="mx-auto h-4 w-40" />
          <Skeleton className="mx-auto h-3 w-56" />
        </div>
      </div>
    </div>
  );
}
