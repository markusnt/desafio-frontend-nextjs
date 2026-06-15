export const MAX_MESSAGE_LENGTH = 4096;

const CONVERSATION_ID_PATTERN = /^c-\d+$/;

export function isValidConversationId(id: string): boolean {
  return CONVERSATION_ID_PATTERN.test(id);
}

export function truncateMessage(text: string, maxLength = MAX_MESSAGE_LENGTH): string {
  return text.slice(0, maxLength);
}
