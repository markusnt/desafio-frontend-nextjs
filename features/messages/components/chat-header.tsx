"use client";

/**
 * Client Component: exibe dados da conversa ativa (via useConversation no pai),
 * botão voltar mobile (Link + useConversationSearch) e estados loading/erro interativos.
 * Mantido Client porque depende de hooks de navegação e retry no client.
 */

import { ArrowLeft, Phone, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Conversation } from "@/lib/api";
import { formatPhone, getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  conversation: Conversation | undefined;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  backHref?: string;
}

function ChatHeaderSkeleton({ showBackButton }: { showBackButton: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-3" aria-hidden>
      {showBackButton ? <Skeleton className="size-9 shrink-0 rounded-full md:hidden" /> : null}
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

export function ChatHeader({
  conversation,
  isLoading,
  isError,
  onRetry,
  backHref,
}: ChatHeaderProps) {
  const showBackButton = Boolean(backHref);

  if (isLoading) {
    return (
      <header className="shrink-0 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <ChatHeaderSkeleton showBackButton={showBackButton} />
      </header>
    );
  }

  if (isError) {
    return (
      <header className="shrink-0 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-3">
          {showBackButton ? (
            <Link
              href={backHref!}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "shrink-0 md:hidden")}
              aria-label="Voltar para lista de conversas"
            >
              <ArrowLeft className="size-4" />
            </Link>
          ) : null}
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Erro ao carregar contato</p>
            {onRetry ? (
              <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5 shrink-0">
                <RefreshCw className="size-3.5" aria-hidden />
                Tentar novamente
              </Button>
            ) : null}
          </div>
        </div>
      </header>
    );
  }

  if (!conversation) {
    return (
      <header className="shrink-0 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-3">
          {showBackButton ? (
            <Link
              href={backHref!}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "shrink-0 md:hidden")}
              aria-label="Voltar para lista de conversas"
            >
              <ArrowLeft className="size-4" />
            </Link>
          ) : null}
          <p className="text-sm text-muted-foreground">Conversa não encontrada</p>
        </div>
      </header>
    );
  }

  return (
    <header className="shrink-0 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2.5 md:gap-3 md:px-4 md:py-3">
        {showBackButton ? (
          <Link
            href={backHref!}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-9 shrink-0 md:hidden")}
            aria-label="Voltar para lista de conversas"
          >
            <ArrowLeft className="size-4" />
          </Link>
        ) : null}

        <Avatar className="size-10 shrink-0 ring-2 ring-background">
          <AvatarFallback
            className="text-xs font-semibold text-white"
            style={{ backgroundColor: conversation.avatarColor }}
          >
            {getInitials(conversation.contactName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold tracking-tight">{conversation.contactName}</h2>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Phone className="size-3 shrink-0" aria-hidden />
            <span>{formatPhone(conversation.contactPhone)}</span>
          </p>
        </div>
      </div>
    </header>
  );
}
