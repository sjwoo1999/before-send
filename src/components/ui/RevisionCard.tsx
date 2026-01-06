'use client';

import { CopyButton } from './CopyButton';
import { revisionLabels } from '@/lib/schema';

interface RevisionCardProps {
    tone: 'soft' | 'neutral' | 'assertive';
    message: string;
    isSelected?: boolean;
    onSelect?: () => void;
}

const toneStyles: Record<'soft' | 'neutral' | 'assertive', {
    border: string;
    bg: string;
    selectedBg: string;
    accent: string;
}> = {
    soft: {
        border: 'border-teal-200',
        bg: 'bg-teal-50/50',
        selectedBg: 'bg-teal-50',
        accent: 'text-teal-600',
    },
    neutral: {
        border: 'border-slate-200',
        bg: 'bg-slate-50/50',
        selectedBg: 'bg-slate-100',
        accent: 'text-slate-600',
    },
    assertive: {
        border: 'border-blue-200',
        bg: 'bg-blue-50/50',
        selectedBg: 'bg-blue-50',
        accent: 'text-blue-600',
    },
};

export function RevisionCard({ tone, message, isSelected, onSelect }: RevisionCardProps) {
    const styles = toneStyles[tone];
    const labels = revisionLabels[tone];

    return (
        <div
            className={`
        relative rounded-xl border-2 p-4 transition-all duration-150
        ${styles.border}
        ${isSelected ? styles.selectedBg : styles.bg}
        ${onSelect ? 'cursor-pointer hover:shadow-md' : ''}
      `}
            onClick={onSelect}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
            onKeyDown={onSelect ? (e) => e.key === 'Enter' && onSelect() : undefined}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <span className={`font-semibold ${styles.accent}`}>
                    {labels.ko}
                </span>
                <CopyButton text={message} size="sm" />
            </div>

            {/* Message */}
            <p className="text-body text-slate-700 whitespace-pre-wrap leading-relaxed">
                {message}
            </p>

            {/* Selected indicator */}
            {isSelected && (
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${styles.accent.replace('text-', 'bg-')}`} />
            )}
        </div>
    );
}

// Skeleton version for loading state
export function RevisionCardSkeleton() {
    return (
        <div className="rounded-xl border-2 border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="skeleton h-5 w-16" />
                <div className="skeleton h-7 w-14" />
            </div>
            <div className="space-y-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-5/6" />
                <div className="skeleton h-4 w-4/6" />
            </div>
        </div>
    );
}
