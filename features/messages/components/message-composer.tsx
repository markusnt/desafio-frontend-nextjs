"use client";

import { Loader2, Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSuggestReply } from "@/features/ai/hooks/use-suggest-reply";
import { useSendMessage } from "@/features/messages/hooks/use-send-message";
import { cn } from "@/lib/utils";

interface MessageComposerProps {
  conversationId: string;
}

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage(conversationId);
  const { mutate: suggestReply, isPending: isSuggesting } = useSuggestReply(conversationId);

  const trimmedText = text.trim();
  const isBusy = isSending || isSuggesting;
  const canSend = trimmedText.length > 0 && !isBusy;

  function handleSend() {
    if (!canSend) {
      return;
    }

    setErrorMessage(null);

    sendMessage(trimmedText, {
      onSuccess: () => {
        setText("");
      },
      onError: () => {
        setErrorMessage("Não foi possível enviar a mensagem. Tente novamente.");
      },
    });
  }

  function handleSuggest() {
    if (isBusy) {
      return;
    }

    setErrorMessage(null);

    suggestReply(undefined, {
      onSuccess: (result) => {
        setText(result.suggestion);
        requestAnimationFrame(() => {
          const textarea = textareaRef.current;
          if (!textarea) {
            return;
          }

          textarea.focus();
          const length = result.suggestion.length;
          textarea.setSelectionRange(length, length);
        });
      },
      onError: () => {
        setErrorMessage("Não foi possível gerar uma sugestão. Tente novamente.");
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
    <div className="shrink-0 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm md:px-5">
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border border-border/70 bg-muted/30 p-2",
          "shadow-sm transition-[box-shadow,border-color] focus-within:border-border focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/10",
        )}
      >
        <div className="flex h-9 shrink-0 items-center justify-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Sugerir resposta com IA"
            title="Sugerir resposta com IA"
            disabled={isBusy}
            onClick={handleSuggest}
            className={cn(
              "size-9 rounded-full",
              isSuggesting
                ? "text-muted-foreground"
                : "text-violet-600 hover:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-400/10",
            )}
          >
            {isSuggesting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="size-4" aria-hidden />
            )}
          </Button>
        </div>

        <Textarea
          ref={textareaRef}
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
          disabled={isBusy}
          spellCheck={false}
          rows={1}
          className={cn(
            "field-sizing-content min-h-9 max-h-28 min-w-0 flex-1 resize-none overflow-y-auto",
            "border-0 bg-transparent px-1 py-2",
            "text-sm leading-5 shadow-none outline-none",
            "placeholder:text-muted-foreground/70",
            "focus-visible:border-0 focus-visible:ring-0",
            "disabled:bg-transparent disabled:opacity-50",
          )}
        />

        <div className="flex h-9 shrink-0 items-center justify-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Enviar mensagem"
            disabled={!canSend}
            onClick={handleSend}
            className={cn(
              "size-9 rounded-full transition-all",
              canSend
                ? "chat-bubble-out shadow-sm hover:opacity-90"
                : "bg-background text-muted-foreground/45 ring-1 ring-border/60",
            )}
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : (
        <p className="mt-2 text-[10px] text-muted-foreground/75">
          <span className="font-medium text-violet-600/90 dark:text-violet-400/90">IA</span>
          {" · "}
          Enter envia · Shift+Enter quebra linha
        </p>
      )}
    </div>
  );
}
