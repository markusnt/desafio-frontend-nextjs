import type { Conversation } from "@/lib/api";

let etag: string | undefined;
let snapshot: Conversation[] | undefined;

export function getConversationsSnapshot(): Conversation[] | undefined {
  return snapshot;
}

export function setConversationsSnapshot(data: Conversation[], nextEtag?: string) {
  snapshot = data;
  if (nextEtag) {
    etag = nextEtag;
  }
}

export function getConversationsEtag(): string | undefined {
  return etag;
}

export function resetConversationsCache() {
  etag = undefined;
  snapshot = undefined;
}
