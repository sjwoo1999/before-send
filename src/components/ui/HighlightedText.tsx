'use client';

import { useMemo } from 'react';
import type { HighlightedWord } from '@/lib/schema';

interface HighlightedTextProps {
    text: string;
    highlights: HighlightedWord[];
}

const highlightTypeLabels: Record<string, string> = {
    blame: '비난',
    generalization: '일반화',
    insult: '모욕',
    threat: '위협',
    sarcasm: '빈정거림',
    accusatory_question: '추궁',
    profanity: '욕설',
    ultimatum: '최후통첩',
};

export function HighlightedText({ text, highlights }: HighlightedTextProps) {
    const segments = useMemo(() => {
        if (!highlights || highlights.length === 0) {
            return [{ text, isHighlight: false }];
        }

        // Sort highlights by start position
        const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

        // Build segments with proper unicode handling
        const textChars = [...text]; // Spread to handle unicode properly
        const result: { text: string; isHighlight: boolean; type?: string }[] = [];
        let lastIndex = 0;

        for (const highlight of sortedHighlights) {
            // Ensure valid offsets
            const start = Math.max(0, Math.min(highlight.start, textChars.length));
            const end = Math.max(start, Math.min(highlight.end, textChars.length));

            // Add text before highlight
            if (start > lastIndex) {
                result.push({
                    text: textChars.slice(lastIndex, start).join(''),
                    isHighlight: false,
                });
            }

            // Add highlighted text
            if (end > start) {
                result.push({
                    text: textChars.slice(start, end).join(''),
                    isHighlight: true,
                    type: highlight.type,
                });
            }

            lastIndex = end;
        }

        // Add remaining text
        if (lastIndex < textChars.length) {
            result.push({
                text: textChars.slice(lastIndex).join(''),
                isHighlight: false,
            });
        }

        return result;
    }, [text, highlights]);

    return (
        <p className="text-body leading-relaxed whitespace-pre-wrap">
            {segments.map((segment, index) => (
                segment.isHighlight ? (
                    <mark
                        key={index}
                        className="highlight-token"
                        title={segment.type ? highlightTypeLabels[segment.type] || segment.type : undefined}
                    >
                        {segment.text}
                    </mark>
                ) : (
                    <span key={index}>{segment.text}</span>
                )
            ))}
        </p>
    );
}
