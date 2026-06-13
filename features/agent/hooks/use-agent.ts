import { useQuery } from "@tanstack/react-query";

import { agentQueryOptions } from "@/features/agent/queries";

export function useAgent() {
  const query = useQuery(agentQueryOptions());

  return {
    agent: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
