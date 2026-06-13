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
  const hasUnread = conversation.unread > 0;

  return (
    <Link
      href={href}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-all outline-none",
        "hover:border-border/60 hover:bg-background/80 hover:shadow-sm",
        "focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && "border-primary/20 bg-background shadow-sm ring-1 ring-primary/10",
        isSelected && "border-l-[3px] border-l-primary pl-[calc(0.75rem-1px)]",
      )}
    >
      <Avatar
        className={cn(
          "size-11 ring-2 ring-background transition-transform group-hover:scale-[1.02]",
          hasUnread && "ring-primary/20",
        )}
      >
        <AvatarFallback
          className="text-xs font-semibold text-white"
          style={{ backgroundColor: conversation.avatarColor }}
        >
          {getInitials(conversation.contactName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              hasUnread ? "font-semibold text-foreground" : "font-medium text-foreground/90",
            )}
          >
            {conversation.contactName}
          </p>
          <time
            className={cn(
              "shrink-0 text-[11px]",
              hasUnread ? "font-medium text-primary" : "text-muted-foreground",
            )}
            dateTime={conversation.lastMessageAt}
          >
            {formatConversationTime(conversation.lastMessageAt)}
          </time>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              hasUnread ? "font-medium text-foreground/80" : "text-muted-foreground",
            )}
          >
            {conversation.lastMessage}
          </p>
          {hasUnread ? (
            <Badge className="h-5 min-w-5 shrink-0 justify-center rounded-full px-1.5 text-[10px] font-bold">
              {conversation.unread > 99 ? "99+" : conversation.unread}
            </Badge>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
