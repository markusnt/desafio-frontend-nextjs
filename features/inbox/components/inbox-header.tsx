"use client";

import { MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgent } from "@/features/agent/hooks/use-agent";
import { getInitials } from "@/lib/format";

export function InboxHeader() {
  const { agent, isLoading, isError, refetch } = useAgent();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <MessageSquare className="size-4" aria-hidden />
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-none">Inbox</h1>
          <p className="text-xs text-muted-foreground">Atendimento WhatsApp</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isLoading ? (
          <>
            <div className="hidden space-y-1 sm:block">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
            <Skeleton className="size-8 rounded-full" />
          </>
        ) : isError || !agent ? (
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        ) : (
          <>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">{agent.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{agent.role}</p>
            </div>
            <Avatar size="sm">
              <AvatarFallback>{getInitials(agent.name)}</AvatarFallback>
            </Avatar>
          </>
        )}
      </div>
    </header>
  );
}
