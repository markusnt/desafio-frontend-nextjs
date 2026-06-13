import { queryOptions } from "@tanstack/react-query";

import { getMe } from "@/lib/api";
import { STALE_TIME } from "@/lib/config/polling";

export const agentKeys = {
  all: ["agent"] as const,
  me: () => [...agentKeys.all, "me"] as const,
};

export function agentQueryOptions() {
  return queryOptions({
    queryKey: agentKeys.me(),
    queryFn: getMe,
    staleTime: STALE_TIME.agent,
  });
}
