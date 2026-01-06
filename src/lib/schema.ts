import { z } from 'zod';

// ===== Input Schemas =====

export const messageInputSchema = z.object({
    situation: z.string().max(100).optional().nullable(),
    original_message: z.string().min(10, "메시지는 최소 10자 이상이어야 합니다").max(500, "메시지는 500자를 초과할 수 없습니다"),
    preferred_tone: z.enum(['soft', 'neutral', 'assertive']).optional().nullable(),
});

export type MessageInput = z.infer<typeof messageInputSchema>;

// ===== AI Response Schemas =====

export const toneLabels = ['aggressive', 'defensive', 'passive_aggressive', 'neutral'] as const;
export type ToneLabel = typeof toneLabels[number];

export const riskLevels = ['high', 'medium', 'low'] as const;
export type RiskLevel = typeof riskLevels[number];

export const highlightTypes = [
    'blame',
    'generalization',
    'insult',
    'threat',
    'sarcasm',
    'accusatory_question',
    'profanity',
    'ultimatum'
] as const;
export type HighlightType = typeof highlightTypes[number];

export const highlightedWordSchema = z.object({
    start: z.number().int().min(0),
    end: z.number().int().min(0),
    type: z.enum(highlightTypes),
    token: z.string(),
});

export type HighlightedWord = z.infer<typeof highlightedWordSchema>;

export const revisedMessagesSchema = z.object({
    soft: z.string().min(1),
    neutral: z.string().min(1),
    assertive: z.string().min(1),
});

export type RevisedMessages = z.infer<typeof revisedMessagesSchema>;

export const claudeResponseSchema = z.object({
    tone_label: z.enum(toneLabels),
    risk_level: z.enum(riskLevels),
    problem_summary: z.string(),
    highlighted_words: z.array(highlightedWordSchema),
    revised: revisedMessagesSchema,
    blocked: z.boolean().optional().default(false),
});

export type ClaudeResponse = z.infer<typeof claudeResponseSchema>;

// ===== API Response Types =====

export interface CheckResult {
    id: string;
    situation: string | null;
    original_message: string;
    tone_analysis: {
        label: ToneLabel;
        risk_level: RiskLevel;
        problem_summary: string;
    };
    highlighted_words: HighlightedWord[];
    revised_options: {
        tone: 'soft' | 'neutral' | 'assertive';
        label: string;
        message: string;
    }[];
    created_at: string;
}

export interface HistoryItem {
    id: string;
    tone_label: ToneLabel;
    original_snippet: string;
    created_at: string;
}

// ===== Revision Labels =====

export const revisionLabels: Record<'soft' | 'neutral' | 'assertive', { ko: string; en: string }> = {
    soft: { ko: '부드럽게', en: 'Soft' },
    neutral: { ko: '중립', en: 'Neutral' },
    assertive: { ko: '단호하게', en: 'Assertive' },
};

// ===== Tone Labels =====

export const toneLabelInfo: Record<ToneLabel, { ko: string; en: string }> = {
    aggressive: { ko: '공격적', en: 'Aggressive' },
    defensive: { ko: '방어적', en: 'Defensive' },
    passive_aggressive: { ko: '수동공격적', en: 'Passive Aggressive' },
    neutral: { ko: '중립적', en: 'Neutral' },
};

// ===== Risk Level Labels =====

export const riskLevelInfo: Record<RiskLevel, { ko: string; en: string }> = {
    high: { ko: '높음', en: 'High' },
    medium: { ko: '중간', en: 'Medium' },
    low: { ko: '낮음', en: 'Low' },
};
