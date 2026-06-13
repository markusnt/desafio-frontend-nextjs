"use client";

import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Conversation } from "@/lib/api";
import { formatConversationTime, getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  href: string;
  isSelected: boolean;
}

export function ConversationItem({ conversation, href, isSelected }: ConversationItemProps) {
  return (
    <Link
      href={href}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 transition-colors outline-none hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && "bg-muted",
      )}
    >
      <Avatar className="size-10">
        <AvatarFallback
          className="text-xs font-medium text-white"
          style={{ backgroundColor: conversation.avatarColor }}
        >
          {getInitials(conversation.contactName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{conversation.contactName}</p>
          <time
            className="shrink-0 text-xs text-muted-foreground"
            dateTime={conversation.lastMessageAt}
          >
            {formatConversationTime(conversation.lastMessageAt)}
          </time>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</p>
          {conversation.unread > 0 ? (
            <Badge variant="default" className="min-w-5 shrink-0 justify-center px-1.5">
              {conversation.unread > 99 ? "99+" : conversation.unread}
            </Badge>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
