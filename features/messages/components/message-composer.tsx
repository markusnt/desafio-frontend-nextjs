"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "@/features/messages/hooks/use-send-message";
import { cn } from "@/lib/utils";

interface MessageComposerProps {
  conversationId: string;
}

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate, isPending } = useSendMessage(conversationId);

  const trimmedText = text.trim();
  const canSend = trimmedText.length > 0 && !isPending;

  function handleSend() {
    if (!canSend) {
      return;
    }

    setErrorMessage(null);

    mutate(trimmedText, {
      onSuccess: () => {
        setText("");
      },
      onError: () => {
        setErrorMessage("Não foi possível enviar a mensagem. Tente novamente.");
      },
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    handleSend();
  }

  return (
    <div className="shrink-0 border-t border-border/60 bg-background/95 px-3 py-3 backdrop-blur-sm md:px-4 md:py-3">
      <div
        className={cn(
          "flex items-end gap-1.5 rounded-full border border-border/70 bg-background py-1 pl-4 pr-1.5",
          "shadow-sm ring-1 ring-border/30 transition-shadow focus-within:border-border focus-within:ring-primary/20",
        )}
      >
        <Textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (errorMessage) {
              setErrorMessage(null);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem…"
          aria-label="Mensagem"
          disabled={isPending}
          rows={1}
          className={cn(
            "min-h-9 max-h-32 min-w-0 flex-1 resize-none border-0 bg-transparent px-0 py-2",
            "text-sm leading-snug shadow-none outline-none",
            "focus-visible:border-0 focus-visible:ring-0",
            "disabled:bg-transparent disabled:opacity-50",
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Enviar mensagem"
          disabled={!canSend}
          onClick={handleSend}
          className={cn(
            "mb-0.5 size-9 shrink-0 rounded-full transition-opacity",
            canSend
              ? "chat-bubble-out hover:opacity-90"
              : "bg-muted text-muted-foreground hover:bg-muted",
          )}
        >
          <Send className="size-4" />
        </Button>
      </div>
      {errorMessage ? (
        <p className="mt-2 px-1 text-xs text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : (
        <p className="mt-1.5 px-1 text-center text-[10px] text-muted-foreground/80">
          Enter para enviar · Shift+Enter para nova linha
        </p>
      )}
    </div>
  );
}
