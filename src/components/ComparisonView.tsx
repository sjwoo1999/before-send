'use client';

import { HighlightedText } from './ui/HighlightedText';
import { CopyButton } from './ui/CopyButton';
import type { HighlightedWord } from '@/lib/schema';

interface ComparisonViewProps {
    originalMessage: string;
    highlightedWords: HighlightedWord[];
    selectedRevision: {
        tone: 'soft' | 'neutral' | 'assertive';
        label: string;
        message: string;
    };
}

export function ComparisonView({
    originalMessage,
    highlightedWords,
    selectedRevision
}: ComparisonViewProps) {
    return (
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
            {/* Original Message */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-rose-700">원본</span>
                </div>
                <HighlightedText text={originalMessage} highlights={highlightedWords} />
            </div>

            {/* Selected Revision */}
            <div className="rounded-xl border border-teal-200 bg-teal-50/30 p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-teal-700">
                        수정본 ({selectedRevision.label})
                    </span>
                    <CopyButton text={selectedRevision.message} size="sm" />
                </div>
                <p className="text-body text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedRevision.message}
                </p>
            </div>
        </div>
    );
}
