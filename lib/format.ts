const TIME_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

function parseDate(iso: string): Date {
  return new Date(iso);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(date: Date, now: Date): boolean {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return isSameDay(date, yesterday);
}

/** Horário curto para bolhas de mensagem (ex.: 14:32). */
export function formatMessageTime(iso: string): string {
  return parseDate(iso).toLocaleTimeString("pt-BR", TIME_FORMAT);
}

/**
 * Horário relativo para a lista de conversas.
 * Hoje → HH:mm | Ontem → "Ontem" | Outros → dd/MM/yyyy
 */
export function formatConversationTime(iso: string, now = new Date()): string {
  const date = parseDate(iso);

  if (isSameDay(date, now)) {
    return date.toLocaleTimeString("pt-BR", TIME_FORMAT);
  }

  if (isYesterday(date, now)) {
    return "Ontem";
  }

  return date.toLocaleDateString("pt-BR", DATE_FORMAT);
}

/** Formata telefone brasileiro quando possível; caso contrário retorna o original. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

/** Iniciais do nome para avatar fallback (ex.: "Maria Silva" → "MS"). */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
