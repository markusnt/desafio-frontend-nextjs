"use client";

import { MessageSquare, RefreshCw } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgent } from "@/features/agent/hooks/use-agent";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

function HeaderBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/40 shadow-sm">
        <MessageSquare className="size-[18px] text-foreground/80" aria-hidden />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground">Inbox</h1>
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium uppercase tracking-wide">
            WhatsApp
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">Central de atendimento</p>
      </div>
    </div>
  );
}

function AgentProfileSkeleton() {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card/50 px-2.5 py-1.5">
      <div className="hidden min-w-0 space-y-1.5 text-right sm:block">
        <Skeleton className="ml-auto h-3.5 w-28" />
        <Skeleton className="ml-auto h-2.5 w-20" />
      </div>
      <Skeleton className="size-9 shrink-0 rounded-full" />
    </div>
  );
}

function AgentProfile() {
  const { agent, isLoading, isError, refetch } = useAgent();

  if (isLoading) {
    return <AgentProfileSkeleton />;
  }

  if (isError || !agent) {
    return (
      <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
        <RefreshCw className="size-3.5" aria-hidden />
        Tentar novamente
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "flex max-w-[min(100%,16rem)] items-center gap-2.5 rounded-lg border border-border/80",
        "bg-card px-2.5 py-1.5 shadow-sm sm:max-w-none sm:gap-3 sm:px-3",
      )}
    >
      <div className="min-w-0 flex-1 sm:flex-none sm:text-right">
        <p className="truncate text-sm font-medium leading-tight">{agent.name}</p>
        <p className="mt-0.5 truncate text-[11px] leading-tight text-muted-foreground sm:text-xs">
          {agent.role}
        </p>
      </div>

      <div className="relative shrink-0">
        <Avatar size="sm" className="size-9 ring-2 ring-background">
          <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
            {getInitials(agent.name)}
          </AvatarFallback>
        </Avatar>
        <span
          className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-emerald-500"
          title="Online"
          aria-label="Status: online"
        />
      </div>
    </div>
  );
}

export function InboxHeader() {
  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/80 bg-background/95 px-4 backdrop-blur-md md:px-6">
      <HeaderBrand />
      <AgentProfile />
    </header>
  );
}
