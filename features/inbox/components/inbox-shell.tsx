import { Suspense } from "react";

import { ConversationListSkeleton } from "@/features/conversations/components/conversation-list-skeleton";
import { InboxShellClient } from "@/features/inbox/components/inbox-shell-client";
import { InboxHeader } from "@/features/inbox/components/inbox-header";

interface InboxShellProps {
  children: React.ReactNode;
}

function InboxShellFallback() {
  return (
    <div className="flex h-dvh flex-col bg-background">
      <InboxHeader />
      <div className="inbox-sidebar-bg flex min-h-0 flex-1 border-r md:w-80 lg:w-[22rem]">
        <ConversationListSkeleton />
      </div>
    </div>
  );
}

export function InboxShell({ children }: InboxShellProps) {
  return (
    <Suspense fallback={<InboxShellFallback />}>
      <InboxShellClient>{children}</InboxShellClient>
    </Suspense>
  );
}
