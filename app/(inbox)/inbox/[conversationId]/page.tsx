import { ChatPanelPlaceholder } from "@/features/inbox/components/chat-panel-placeholder";

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;

  return <ChatPanelPlaceholder conversationId={conversationId} />;
}
