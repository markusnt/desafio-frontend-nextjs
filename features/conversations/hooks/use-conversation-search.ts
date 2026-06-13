"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useConversationSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const setSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const buildConversationHref = useCallback(
    (conversationId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const queryString = params.toString();
      return queryString ? `/inbox/${conversationId}?${queryString}` : `/inbox/${conversationId}`;
    },
    [searchParams],
  );

  const inboxHref = search ? `/inbox?search=${encodeURIComponent(search)}` : "/inbox";

  return { search, setSearch, buildConversationHref, inboxHref };
}
