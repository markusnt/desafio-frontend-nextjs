interface ChatPanelTransitionProps {
  conversationKey: string;
  children: React.ReactNode;
}

export function ChatPanelTransition({ conversationKey, children }: ChatPanelTransitionProps) {
  return (
    <div
      key={conversationKey}
      className="flex min-h-0 flex-1 flex-col motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-right-3 motion-safe:duration-300"
    >
      {children}
    </div>
  );
}
