import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export default function ConversationNotFound() {
  return (
    <EmptyState
      title="Conversa não encontrada"
      description="Este link pode estar desatualizado ou a conversa foi removida."
      action={
        <Link href="/inbox" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Voltar para o inbox
        </Link>
      }
      className="flex-1"
    />
  );
}
