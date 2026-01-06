// Temporary in-memory storage for anonymous users (expires after 1 hour)

interface TempEntry {
    data: unknown;
    expires: number;
}

const tempResults = new Map<string, TempEntry>();

export function setTempResult(id: string, data: unknown): void {
    tempResults.set(id, {
        data,
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    // Clean up expired entries
    for (const [key, value] of tempResults.entries()) {
        if (value.expires < Date.now()) {
            tempResults.delete(key);
        }
    }
}

export function getTempResult(id: string): unknown | null {
    const entry = tempResults.get(id);
    if (!entry || entry.expires < Date.now()) {
        tempResults.delete(id);
        return null;
    }
    return entry.data;
}
