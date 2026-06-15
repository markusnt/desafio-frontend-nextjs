import { ChatPanelTransition } from "@/features/inbox/components/chat-panel-transition";
import { ChatPanel } from "@/features/messages/components/chat-panel";
import { getQueryClient } from "@/lib/query-client";
import { prefetchConversationMessages } from "@/lib/prefetch-inbox";

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;
  const queryClient = getQueryClient();

  await prefetchConversationMessages(queryClient, conversationId);

  return (
    <ChatPanelTransition conversationKey={conversationId}>
      <ChatPanel conversationId={conversationId} />
    </ChatPanelTransition>
  );
}
