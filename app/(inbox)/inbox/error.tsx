"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface InboxErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InboxError({ reset }: InboxErrorProps) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Algo deu errado"
      description="Não foi possível carregar esta página. Tente novamente."
      action={
        <Button variant="outline" size="sm" onClick={reset}>
          Tentar novamente
        </Button>
      }
      className="h-full"
    />
  );
}
