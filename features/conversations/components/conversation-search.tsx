"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useConversationSearch } from "@/features/conversations/hooks/use-conversation-search";

export function ConversationSearch() {
  const { search, setSearch } = useConversationSearch();

  return (
    <div className="px-3 pb-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar conversas…"
          aria-label="Buscar conversas"
          className="pl-8"
        />
      </div>
    </div>
  );
}
