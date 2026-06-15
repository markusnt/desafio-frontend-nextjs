"use client";

import { useParams } from "next/navigation";

import { ConversationList } from "@/features/conversations/components/conversation-list";
import { InboxHeader } from "@/features/inbox/components/inbox-header";
import { cn } from "@/lib/utils";

interface InboxShellClientProps {
  children: React.ReactNode;
}

export function InboxShellClient({ children }: InboxShellClientProps) {
  const params = useParams<{ conversationId?: string }>();
  const conversationId = params.conversationId ?? null;
  const isChatOpen = Boolean(conversationId);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <InboxHeader />

      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "inbox-sidebar-bg w-full shrink-0 border-r md:w-80 lg:w-[22rem]",
            isChatOpen ? "hidden md:flex md:flex-col" : "flex flex-col",
          )}
          aria-label="Lista de conversas"
        >
          <ConversationList />
        </aside>

        <main
          className={cn(
            "inbox-chat-bg min-w-0 flex-1 flex-col",
            isChatOpen ? "flex" : "hidden md:flex",
          )}
          aria-label={isChatOpen ? "Conversa aberta" : "Painel de chat"}
        >
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
}
