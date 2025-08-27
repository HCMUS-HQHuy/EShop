const MAX_LENGTH = 10;

export function generateCode(id: string): string {
    const userIdPart = id.toString().padStart(4, '0').slice(-4);
    const timestampPart = Date.now().toString(36).toUpperCase().slice(-8);
    const code = (timestampPart + userIdPart).slice(0, MAX_LENGTH);
    return code;
}
