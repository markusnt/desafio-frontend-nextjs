import { Check, CheckCheck, Clock } from "lucide-react";

import type { Message } from "@/lib/api";
import { formatMessageTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function isOptimisticMessage(message: Message): boolean {
  return message.id.startsWith("optimistic-");
}

function MessageStatusIcon({ status }: { status: Message["status"] }) {
  if (status === "read") {
    return (
      <CheckCheck
        className="size-3 text-sky-600 dark:text-sky-400"
        aria-label="Lida"
      />
    );
  }

  if (status === "delivered") {
    return <CheckCheck className="size-3 opacity-70" aria-label="Entregue" />;
  }

  return <Check className="size-3 opacity-70" aria-label="Enviada" />;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.direction === "out";
  const isPending = isOptimisticMessage(message);

  return (
    <div
      className={cn("flex w-full", isOutgoing ? "justify-end" : "justify-start")}
      data-direction={message.direction}
    >
      <div
        className={cn(
          "relative max-w-[min(85%,28rem)] px-3.5 py-2 transition-opacity",
          isPending && "opacity-70",
          isOutgoing
            ? "chat-bubble-out rounded-2xl rounded-tr-sm"
            : "chat-bubble-in rounded-2xl rounded-tl-sm",
        )}
      >
        <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">{message.body}</p>
        <time
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px] leading-none",
            isOutgoing ? "chat-bubble-out-muted" : "chat-bubble-in-muted",
          )}
          dateTime={message.createdAt}
        >
          {isPending ? (
            <>
              <Clock className="size-2.5" aria-hidden />
              <span>Enviando…</span>
            </>
          ) : (
            <>
              <span>{formatMessageTime(message.createdAt)}</span>
              {isOutgoing ? <MessageStatusIcon status={message.status} /> : null}
            </>
          )}
        </time>
      </div>
    </div>
  );
}
