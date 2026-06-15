import type { Message } from "@/lib/api";
import { formatMessageTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.direction === "out";

  return (
    <div
      className={cn("flex w-full", isOutgoing ? "justify-end" : "justify-start")}
      data-direction={message.direction}
    >
      <div
        className={cn(
          "relative max-w-[min(85%,28rem)] px-3.5 py-2 shadow-sm",
          isOutgoing
            ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-2xl rounded-tl-sm border border-border/60 bg-card text-card-foreground",
        )}
      >
        <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">{message.body}</p>
        <time
          className={cn(
            "mt-1 block text-[10px] leading-none",
            isOutgoing ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
          dateTime={message.createdAt}
        >
          {formatMessageTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}
