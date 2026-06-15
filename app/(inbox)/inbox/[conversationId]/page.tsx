import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ChatPanelTransition } from "@/features/inbox/components/chat-panel-transition";
import { ChatPanel } from "@/features/messages/components/chat-panel";
import { getDehydrateOptions, getQueryClient } from "@/lib/query-client";
import { prefetchConversationChat } from "@/lib/prefetch-inbox";

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;
  const queryClient = getQueryClient();

  await prefetchConversationChat(queryClient, conversationId);

  return (
    <HydrationBoundary state={dehydrate(queryClient, getDehydrateOptions())}>
      <ChatPanelTransition conversationKey={conversationId}>
        <ChatPanel conversationId={conversationId} />
      </ChatPanelTransition>
    </HydrationBoundary>
  );
}
