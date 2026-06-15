import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { InboxShell } from "@/features/inbox/components/inbox-shell";
import { getDehydrateOptions, getQueryClient } from "@/lib/query-client";
import { prefetchConversations } from "@/lib/prefetch-inbox";

export default async function InboxLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  await prefetchConversations(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient, getDehydrateOptions())}>
      <InboxShell>{children}</InboxShell>
    </HydrationBoundary>
  );
}
