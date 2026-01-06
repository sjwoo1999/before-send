'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface MoodRxCtaProps {
    className?: string;
}

// Placeholder URL - to be replaced with actual Mood Rx deep link
const MOOD_RX_URL = '/mood-rx';

export function MoodRxCta({ className = '' }: MoodRxCtaProps) {
    return (
        <div className={`rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">
                        먼저 감정을 정리할까요?
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                        감정이 격앙된 상태에서는 좋은 메시지를 작성하기 어려워요.
                        Mood Rx로 마음을 진정시킨 후 다시 시도해 보세요.
                    </p>
                    <Link
                        href={MOOD_RX_URL}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors focus-ring"
                    >
                        <Sparkles className="w-4 h-4" />
                        Mood Rx 시작하기
                    </Link>
                </div>
            </div>
        </div>
    );
}
