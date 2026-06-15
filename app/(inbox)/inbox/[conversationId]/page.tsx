import { ChatPanelTransition } from "@/features/inbox/components/chat-panel-transition";
import { ChatPanel } from "@/features/messages/components/chat-panel";

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;

  return (
    <ChatPanelTransition conversationKey={conversationId}>
      <ChatPanel conversationId={conversationId} />
    </ChatPanelTransition>
  );
}
