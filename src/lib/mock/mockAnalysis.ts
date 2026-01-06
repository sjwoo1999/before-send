/**
 * Mock AI Analysis - Simulates Claude API responses for testing
 */

import type { ClaudeResponse, ToneLabel, RiskLevel, HighlightedWord } from '@/lib/schema';

// Keywords for tone detection
const AGGRESSIVE_KEYWORDS = ['왜', '도대체', '진짜', '대체', '뭐야'];
const GENERALIZATION_KEYWORDS = ['맨날', '항상', '늘', '절대', '전혀'];
const INSULT_KEYWORDS = ['한심', '바보', '멍청', '짜증', '미친'];
const PASSIVE_AGGRESSIVE_KEYWORDS = ['알겠어', '그래', '좋을대로', '상관없', '맘대로'];
const DEFENSIVE_KEYWORDS = ['내 잘못', '그게 아니라', '오해', '너야말로'];

/**
 * Analyze message and return mock Claude response
 */
export function getMockAnalysis(originalMessage: string, preferredTone?: string | null): ClaudeResponse {
    const tone = detectTone(originalMessage);
    const riskLevel = getRiskLevel(tone);
    const highlights = detectHighlights(originalMessage);

    return {
        tone_label: tone,
        risk_level: riskLevel,
        problem_summary: getProblemSummary(tone, highlights.length),
        highlighted_words: highlights,
        revised: {
            soft: generateSoftRevision(originalMessage),
            neutral: generateNeutralRevision(originalMessage),
            assertive: generateAssertiveRevision(originalMessage),
        },
        blocked: false,
    };
}

function detectTone(message: string): ToneLabel {
    const lower = message.toLowerCase();

    // Check for aggressive indicators
    const hasAggressive = AGGRESSIVE_KEYWORDS.some(k => lower.includes(k)) ||
        INSULT_KEYWORDS.some(k => lower.includes(k));
    const hasGeneralization = GENERALIZATION_KEYWORDS.some(k => lower.includes(k));

    if (hasAggressive && hasGeneralization) {
        return 'aggressive';
    }

    // Check for passive aggressive
    const hasPassiveAggressive = PASSIVE_AGGRESSIVE_KEYWORDS.some(k => lower.includes(k));
    if (hasPassiveAggressive && hasGeneralization) {
        return 'passive_aggressive';
    }

    // Check for defensive
    const hasDefensive = DEFENSIVE_KEYWORDS.some(k => lower.includes(k));
    if (hasDefensive) {
        return 'defensive';
    }

    // Check for mild aggressive
    if (hasAggressive || hasGeneralization) {
        return 'aggressive';
    }

    if (hasPassiveAggressive) {
        return 'passive_aggressive';
    }

    return 'neutral';
}

function getRiskLevel(tone: ToneLabel): RiskLevel {
    switch (tone) {
        case 'aggressive':
            return 'high';
        case 'passive_aggressive':
        case 'defensive':
            return 'medium';
        default:
            return 'low';
    }
}

function detectHighlights(message: string): HighlightedWord[] {
    const highlights: HighlightedWord[] = [];

    const patterns: { keywords: string[]; type: HighlightedWord['type'] }[] = [
        { keywords: GENERALIZATION_KEYWORDS, type: 'generalization' },
        { keywords: INSULT_KEYWORDS, type: 'insult' },
        { keywords: AGGRESSIVE_KEYWORDS.slice(0, 2), type: 'accusatory_question' }, // 왜, 도대체
    ];

    for (const { keywords, type } of patterns) {
        for (const keyword of keywords) {
            let index = message.indexOf(keyword);
            while (index !== -1) {
                highlights.push({
                    start: index,
                    end: index + keyword.length,
                    type,
                    token: keyword,
                });
                index = message.indexOf(keyword, index + 1);
            }
        }
    }

    // Sort by start position and remove duplicates
    return highlights
        .sort((a, b) => a.start - b.start)
        .filter((h, i, arr) => i === 0 || h.start !== arr[i - 1].start);
}

function getProblemSummary(tone: ToneLabel, highlightCount: number): string {
    const summaries: Record<ToneLabel, string> = {
        aggressive: `이 메시지에는 상대방을 비난하거나 일반화하는 표현이 ${highlightCount}개 포함되어 있어요. 이러한 표현은 상대방을 방어적으로 만들 수 있습니다.`,
        defensive: '이 메시지는 자신을 방어하려는 톤이 강해서, 대화가 책임 공방으로 흐를 수 있어요.',
        passive_aggressive: '겉으로는 동의하는 것 같지만 속으로는 불만이 담긴 표현이에요. 상대방이 혼란스러울 수 있습니다.',
        neutral: '전반적으로 중립적인 톤이에요. 큰 문제는 없어 보입니다.',
    };

    return summaries[tone];
}

function generateSoftRevision(original: string): string {
    // Simple mock transformation - add softening phrases
    const prefix = '혹시 시간 되시면 ';
    const suffix = ' 어떻게 생각하세요?';

    // Remove aggressive words and rephrase
    let revised = original
        .replace(/왜/g, '')
        .replace(/맨날|항상/g, '가끔')
        .replace(/진짜|도대체/g, '')
        .replace(/한심하다|바보야/g, '아쉬워요')
        .replace(/\?+/g, '.')
        .trim();

    if (revised.length < 10) {
        revised = '제 마음을 전하고 싶은데, ' + revised;
    }

    return revised + (revised.endsWith('.') ? '' : '.') + ' 이야기 나눠볼 수 있을까요?';
}

function generateNeutralRevision(original: string): string {
    // Remove emotional words, keep facts
    let revised = original
        .replace(/왜|도대체|진짜/g, '')
        .replace(/맨날|항상|늘/g, '최근에')
        .replace(/한심하다|바보야|짜증나/g, '')
        .replace(/\?+/g, '.')
        .replace(/!+/g, '.')
        .trim();

    // Clean up multiple spaces
    revised = revised.replace(/\s+/g, ' ').trim();

    if (revised.length < 5) {
        revised = '확인 부탁드립니다.';
    }

    return revised + (revised.endsWith('.') ? '' : '.');
}

function generateAssertiveRevision(original: string): string {
    // Clear boundaries without insults
    let revised = original
        .replace(/왜.*?야\?/g, '')
        .replace(/맨날|항상/g, '여러 번')
        .replace(/한심하다|바보야/g, '어렵습니다')
        .replace(/\?+/g, '.')
        .trim();

    const assertiveEnding = ' 이 부분은 개선이 필요합니다.';

    if (revised.length < 10) {
        revised = '분명하게 말씀드리자면, 현재 상황은';
    }

    return revised + assertiveEnding;
}
