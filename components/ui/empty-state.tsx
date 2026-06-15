import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-8 py-16 text-center",
        className,
      )}
    >
      {Icon ? (
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
          <Icon className="size-7 text-primary" aria-hidden />
        </div>
      ) : null}
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
        {description ? (
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
