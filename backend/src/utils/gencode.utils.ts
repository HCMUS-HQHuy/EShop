const MAX_LENGTH = 15;

export function generateCode(prefixPart: string, id: string): string {
    const userIdPart = id.toString().padStart(4, '0').slice(-4);
    const timestampPart = Date.now().toString(36).toUpperCase().slice(-8);
    const code = (prefixPart + timestampPart + userIdPart).slice(0, MAX_LENGTH);
    return code;
}