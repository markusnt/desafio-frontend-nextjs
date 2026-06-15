import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PLACEHOLDER_BUBBLES = [
  { align: "start", width: "w-[55%]", radius: "rounded-2xl rounded-tl-sm" },
  { align: "end", width: "w-[45%]", radius: "rounded-2xl rounded-tr-sm" },
  { align: "start", width: "w-[70%]", radius: "rounded-2xl rounded-tl-sm" },
  { align: "end", width: "w-[50%]", radius: "rounded-2xl rounded-tr-sm" },
  { align: "start", width: "w-[40%]", radius: "rounded-2xl rounded-tl-sm" },
  { align: "end", width: "w-[60%]", radius: "rounded-2xl rounded-tr-sm" },
] as const;

export function MessageListSkeleton() {
  return (
    <div
      className="flex flex-1 flex-col gap-3 px-4 py-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Carregando mensagens"
    >
      <span className="sr-only">Carregando mensagens…</span>
      {PLACEHOLDER_BUBBLES.map((bubble, index) => (
        <div
          key={index}
          className={cn("flex w-full", bubble.align === "end" ? "justify-end" : "justify-start")}
          aria-hidden
        >
          <Skeleton className={cn("h-14", bubble.width, bubble.radius)} />
        </div>
      ))}
    </div>
  );
}
