'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
    text: string;
    className?: string;
    size?: 'sm' | 'md';
}

export function CopyButton({ text, className = '', size = 'md' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [text]);

    const sizeClasses = size === 'sm'
        ? 'px-2.5 py-1 text-xs gap-1'
        : 'px-3 py-1.5 text-sm gap-1.5';

    const iconSize = size === 'sm' ? 12 : 14;

    return (
        <button
            onClick={handleCopy}
            className={`
        inline-flex items-center font-medium rounded-lg
        transition-all duration-150 focus-ring
        ${copied
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }
        ${sizeClasses}
        ${className}
      `}
            aria-label={copied ? '복사됨' : '클립보드에 복사'}
        >
            {copied ? (
                <>
                    <Check size={iconSize} aria-hidden="true" />
                    <span>복사됨</span>
                </>
            ) : (
                <>
                    <Copy size={iconSize} aria-hidden="true" />
                    <span>복사</span>
                </>
            )}
        </button>
    );
}
