/**
 * Mock History Storage - In-memory storage for mock mode testing
 */

import type { CheckResult, HistoryItem, ToneLabel } from '@/lib/schema';

interface MockCheck extends CheckResult {
    user_id: string;
}

// In-memory storage (resets on server restart)
const mockChecks = new Map<string, MockCheck>();

// Default mock user for anonymous testing
const MOCK_USER_ID = 'mock-user-001';

/**
 * Add a check to mock storage
 */
export function addMockCheck(check: CheckResult): void {
    mockChecks.set(check.id, {
        ...check,
        user_id: MOCK_USER_ID,
    });
}

/**
 * Get a check by ID
 */
export function getMockCheck(id: string): CheckResult | null {
    const check = mockChecks.get(id);
    if (!check) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id, ...result } = check;
    return result;
}

/**
 * Get all checks for mock user
 */
export function getMockHistory(): HistoryItem[] {
    const items: HistoryItem[] = [];

    for (const check of mockChecks.values()) {
        items.push({
            id: check.id,
            tone_label: check.tone_analysis.label as ToneLabel,
            original_snippet: check.original_message.length > 50
                ? check.original_message.substring(0, 50) + '...'
                : check.original_message,
            created_at: check.created_at,
        });
    }

    // Sort by created_at descending
    return items.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

/**
 * Delete a check by ID
 */
export function deleteMockCheck(id: string): boolean {
    return mockChecks.delete(id);
}

/**
 * Clear all mock data (for testing)
 */
export function clearMockData(): void {
    mockChecks.clear();
}

/**
 * Get count of mock checks
 */
export function getMockCheckCount(): number {
    return mockChecks.size;
}
