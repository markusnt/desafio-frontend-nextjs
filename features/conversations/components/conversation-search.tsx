"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useConversationSearch } from "@/features/conversations/hooks/use-conversation-search";

export function ConversationSearch() {
  const { search, setSearch } = useConversationSearch();

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por nome ou mensagem…"
        aria-label="Buscar conversas"
        className="h-9 rounded-full border-transparent bg-background/80 pl-9 shadow-sm ring-1 ring-border/60 transition-shadow placeholder:text-muted-foreground/80 focus-visible:bg-background focus-visible:ring-primary/30"
      />
    </div>
  );
}
