import { Phone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Conversation } from "@/lib/api";
import { formatPhone, getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  conversation: Conversation | undefined;
  isLoading?: boolean;
}

function ChatHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3" aria-hidden>
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

export function ChatHeader({ conversation, isLoading }: ChatHeaderProps) {
  if (isLoading || !conversation) {
    return (
      <header className="shrink-0 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <ChatHeaderSkeleton />
      </header>
    );
  }

  return (
    <header className="shrink-0 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar className="size-10 ring-2 ring-background">
          <AvatarFallback
            className="text-xs font-semibold text-white"
            style={{ backgroundColor: conversation.avatarColor }}
          >
            {getInitials(conversation.contactName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold tracking-tight">{conversation.contactName}</h2>
          <p
            className={cn(
              "mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground",
            )}
          >
            <Phone className="size-3 shrink-0" aria-hidden />
            <span>{formatPhone(conversation.contactPhone)}</span>
          </p>
        </div>
      </div>
    </header>
  );
}
