"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { agentQueryOptions } from "@/features/agent/queries";
import { getInitials } from "@/lib/format";

export function InboxHeader() {
  const { data, isLoading, isError } = useQuery(agentQueryOptions());

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
        ) : isError || !data ? (
          <span className="text-xs text-destructive">Erro ao carregar perfil</span>
        ) : (
          <>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">{data.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{data.role}</p>
            </div>
            <Avatar size="sm">
              <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
            </Avatar>
          </>
        )}
      </div>
    </header>
  );
}
