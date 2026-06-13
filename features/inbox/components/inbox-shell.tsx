"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { ConversationList } from "@/features/conversations/components/conversation-list";
import { ConversationListSkeleton } from "@/features/conversations/components/conversation-list-skeleton";
import { useConversationSearch } from "@/features/conversations/hooks/use-conversation-search";
import { InboxHeader } from "@/features/inbox/components/inbox-header";
import { cn } from "@/lib/utils";

interface InboxShellProps {
  children: React.ReactNode;
}

function InboxShellContent({ children }: InboxShellProps) {
  const params = useParams<{ conversationId?: string }>();
  const conversationId = params.conversationId ?? null;
  const isChatOpen = Boolean(conversationId);
  const { inboxHref } = useConversationSearch();

  return (
    <div className="flex h-dvh flex-col bg-background">
      <InboxHeader />

      <div className="flex min-h-0 flex-1">
        <div
          className={cn(
            "inbox-sidebar-bg w-full shrink-0 border-r md:w-80 lg:w-[22rem]",
            isChatOpen ? "hidden md:flex md:flex-col" : "flex flex-col",
          )}
        >
          <ConversationList />
        </div>

        <main
          className={cn(
            "inbox-chat-bg min-w-0 flex-1 flex-col",
            isChatOpen ? "flex" : "hidden md:flex",
          )}
        >
          {isChatOpen ? (
            <div className="flex shrink-0 items-center border-b border-border/60 bg-background/90 p-2 backdrop-blur-sm md:hidden">
              <Link
                href={inboxHref}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                <ArrowLeft data-icon="inline-start" />
                Conversas
              </Link>
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function InboxShell({ children }: InboxShellProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh flex-col bg-background">
          <InboxHeader />
          <div className="inbox-sidebar-bg flex min-h-0 flex-1 border-r md:w-80 lg:w-[22rem]">
            <ConversationListSkeleton />
          </div>
        </div>
      }
    >
      <InboxShellContent>{children}</InboxShellContent>
    </Suspense>
  );
}
