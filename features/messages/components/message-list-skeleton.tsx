import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PLACEHOLDER_BUBBLES = [
  { align: "start", width: "w-[55%]" },
  { align: "end", width: "w-[45%]" },
  { align: "start", width: "w-[70%]" },
  { align: "end", width: "w-[50%]" },
  { align: "start", width: "w-[40%]" },
  { align: "end", width: "w-[60%]" },
] as const;

export function MessageListSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3 px-4 py-4" aria-hidden>
      {PLACEHOLDER_BUBBLES.map((bubble, index) => (
        <div
          key={index}
          className={cn("flex w-full", bubble.align === "end" ? "justify-end" : "justify-start")}
        >
          <Skeleton className={cn("h-14 rounded-2xl", bubble.width)} />
        </div>
      ))}
    </div>
  );
}
