// Blocked intent keywords (Korean)
export const BLOCKED_KEYWORDS = [
    '죽여',
    '때려',
    '신고',
    '고소',
    '협박',
    '살해',
    '자살',
    '폭행',
] as const;

// User-facing message when content is blocked
export const BLOCKED_MESSAGE = '이 메시지는 분석할 수 없습니다. 도움이 필요하시면 전문 상담을 권장합니다.';

// Safety disclaimer
export const SAFETY_DISCLAIMER = '이 서비스는 관계 조언을 제공하지 않습니다. 심각한 갈등 상황에서는 전문가 상담을 권장합니다.';

/**
 * Check if the message contains any blocked keywords
 * @param message The message to check
 * @returns Object with blocked status and matched keyword (if any)
 */
export function checkBlockedKeywords(message: string): {
    isBlocked: boolean;
    matchedKeyword?: string;
} {
    const lowerMessage = message.toLowerCase();

    for (const keyword of BLOCKED_KEYWORDS) {
        if (lowerMessage.includes(keyword)) {
            return {
                isBlocked: true,
                matchedKeyword: keyword,
            };
        }
    }

    return { isBlocked: false };
}

/**
 * Check if the AI response indicates blocked content
 * @param blocked The blocked field from Claude response
 * @returns boolean
 */
export function isAIBlocked(blocked: boolean | undefined): boolean {
    return blocked === true;
}
