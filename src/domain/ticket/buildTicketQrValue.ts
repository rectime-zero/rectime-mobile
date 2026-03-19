export function buildTicketQrValue(userId: string, totpValue: string): string {
    return `rectime:${userId}:${totpValue}`;
}
