'use client';

import { AlertTriangle, Shield, EyeOff, CheckCircle2 } from 'lucide-react';
import type { ToneLabel } from '@/lib/schema';

interface ToneBadgeProps {
    tone: ToneLabel;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

const toneConfig: Record<ToneLabel, {
    icon: typeof AlertTriangle;
    label: string;
    className: string;
}> = {
    aggressive: {
        icon: AlertTriangle,
        label: '공격적',
        className: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    },
    defensive: {
        icon: Shield,
        label: '방어적',
        className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    },
    passive_aggressive: {
        icon: EyeOff,
        label: '수동공격적',
        className: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
    },
    neutral: {
        icon: CheckCircle2,
        label: '중립적',
        className: 'bg-green-50 text-green-700 ring-1 ring-green-200',
    },
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
};

const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
};

export function ToneBadge({ tone, size = 'md', showLabel = true }: ToneBadgeProps) {
    const config = toneConfig[tone];
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full ${config.className} ${sizeClasses[size]}`}
            role="status"
            aria-label={`톤: ${config.label}`}
        >
            <Icon size={iconSizes[size]} aria-hidden="true" />
            {showLabel && <span>{config.label}</span>}
        </span>
    );
}
