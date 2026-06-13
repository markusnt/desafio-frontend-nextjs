"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { ConversationSidebar } from "@/features/inbox/components/conversation-sidebar";
import { InboxHeader } from "@/features/inbox/components/inbox-header";
import { cn } from "@/lib/utils";

interface InboxShellProps {
  children: React.ReactNode;
}

function getConversationId(pathname: string): string | null {
  const match = pathname.match(/^\/inbox\/([^/]+)$/);
  return match?.[1] ?? null;
}

export function InboxShell({ children }: InboxShellProps) {
  const pathname = usePathname();
  const conversationId = getConversationId(pathname);
  const isChatOpen = Boolean(conversationId);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <InboxHeader />

      <div className="flex min-h-0 flex-1">
        <div
          className={cn(
            "w-full shrink-0 border-r md:w-80 lg:w-96",
            isChatOpen ? "hidden md:flex md:flex-col" : "flex flex-col",
          )}
        >
          <ConversationSidebar />
        </div>

        <main
          className={cn(
            "min-w-0 flex-1 flex-col bg-muted/30",
            isChatOpen ? "flex" : "hidden md:flex",
          )}
        >
          {isChatOpen ? (
            <div className="flex shrink-0 items-center border-b bg-background p-2 md:hidden">
              <Link href="/inbox" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
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
