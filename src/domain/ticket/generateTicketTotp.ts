function hashString(value: string): number {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash = Math.abs((hash * 16777619 + value.charCodeAt(index)) % 2147483647);
    }

    return hash;
}

export function generateTicketTotp(userId: string, secret: string, timestamp: number = Date.now()): string {
    const step = Math.floor(timestamp / 30000);
    const seed = `${userId}:${secret}:${step}`;
    const hash = hashString(seed) % 1000000;

    return hash.toString().padStart(6, '0');
}
