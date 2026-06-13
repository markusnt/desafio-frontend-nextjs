import { InboxShell } from "@/features/inbox/components/inbox-shell";

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  return <InboxShell>{children}</InboxShell>;
}
