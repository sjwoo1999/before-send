'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookmarkPlus } from 'lucide-react';
import { ToneBadge } from '@/components/ui/ToneBadge';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { HighlightedText } from '@/components/ui/HighlightedText';
import { RevisionCard, RevisionCardSkeleton } from '@/components/ui/RevisionCard';
import { ComparisonView } from '@/components/ComparisonView';
import { MoodRxCta } from '@/components/MoodRxCta';
import type { CheckResult } from '@/lib/schema';

interface ResultPageProps {
    params: { id: string };
}

export default function ResultPage({ params }: ResultPageProps) {
    const { id } = params;
    const router = useRouter();
    const [result, setResult] = useState<CheckResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTone, setSelectedTone] = useState<'soft' | 'neutral' | 'assertive'>('soft');
    const [showComparison, setShowComparison] = useState(false);

    useEffect(() => {
        async function fetchResult() {
            try {
                const response = await fetch(`/api/check/${id}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('결과를 찾을 수 없습니다.');
                    } else if (response.status === 401) {
                        // Redirect to login
                        router.push('/login?redirect=/check/result/' + id);
                        return;
                    } else {
                        setError('결과를 불러오는데 실패했습니다.');
                    }
                    return;
                }

                const data = await response.json();
                setResult(data);
            } catch {
                setError('네트워크 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchResult();
    }, [id, router]);

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    if (!result) {
        return <ErrorState message="결과를 불러올 수 없습니다." />;
    }

    const selectedRevision = result.revised_options.find(r => r.tone === selectedTone)!;
    const showMoodRxCta = result.tone_analysis.risk_level === 'high' ||
        ['aggressive', 'passive_aggressive'].includes(result.tone_analysis.label);

    return (
        <main className="min-h-screen bg-slate-50 pb-8">
            {/* Header */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-10">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/check"
                            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                            aria-label="새 분석"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <h1 className="text-h2 text-slate-900">분석 결과</h1>
                    </div>
                    <button
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                        aria-label="저장하기"
                    >
                        <BookmarkPlus className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Tone & Risk Summary */}
                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <ToneBadge tone={result.tone_analysis.label} size="lg" />
                        <RiskBadge level={result.tone_analysis.risk_level} />
                    </div>
                    <p className="text-body text-slate-600">
                        {result.tone_analysis.problem_summary}
                    </p>
                </section>

                {/* Mood Rx CTA (conditional) */}
                {showMoodRxCta && <MoodRxCta />}

                {/* Original Message with Highlights */}
                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">원본 메시지</h2>
                    <HighlightedText
                        text={result.original_message}
                        highlights={result.highlighted_words}
                    />
                    {result.highlighted_words.length > 0 && (
                        <p className="text-caption mt-3">
                            <span className="highlight-token text-xs">하이라이트된 부분</span>이 관계에 부정적 영향을 줄 수 있어요.
                        </p>
                    )}
                </section>

                {/* Revision Cards */}
                <section>
                    <h2 className="text-sm font-semibold text-slate-500 mb-3">수정안 선택</h2>
                    <div className="space-y-3">
                        {result.revised_options.map((option) => (
                            <RevisionCard
                                key={option.tone}
                                tone={option.tone as 'soft' | 'neutral' | 'assertive'}
                                message={option.message}
                                isSelected={selectedTone === option.tone}
                                onSelect={() => setSelectedTone(option.tone as 'soft' | 'neutral' | 'assertive')}
                            />
                        ))}
                    </div>
                </section>

                {/* Comparison Toggle */}
                <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="w-full py-3 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                    {showComparison ? '비교 숨기기' : '원본과 비교하기'}
                </button>

                {/* Comparison View */}
                {showComparison && (
                    <ComparisonView
                        originalMessage={result.original_message}
                        highlightedWords={result.highlighted_words}
                        selectedRevision={selectedRevision}
                    />
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Link
                        href="/check"
                        className="flex-1 py-3 text-center font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        새 메시지 분석
                    </Link>
                    <Link
                        href="/history"
                        className="flex-1 py-3 text-center font-medium text-white bg-teal-500 rounded-xl hover:bg-teal-600 transition-colors"
                    >
                        분석 기록 보기
                    </Link>
                </div>
            </div>
        </main>
    );
}

function LoadingState() {
    return (
        <main className="min-h-screen bg-slate-50">
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-200">
                <div className="max-w-2xl mx-auto px-4 py-3">
                    <div className="skeleton h-6 w-24" />
                </div>
            </header>
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Summary skeleton */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                    <div className="flex gap-2 mb-3">
                        <div className="skeleton h-6 w-20" />
                        <div className="skeleton h-6 w-16" />
                    </div>
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-3/4 mt-2" />
                </div>

                {/* Original message skeleton */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                    <div className="skeleton h-4 w-20 mb-3" />
                    <div className="space-y-2">
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-5/6" />
                        <div className="skeleton h-4 w-4/6" />
                    </div>
                </div>

                {/* Revision cards skeleton */}
                <div>
                    <div className="skeleton h-4 w-20 mb-3" />
                    <div className="space-y-3">
                        <RevisionCardSkeleton />
                        <RevisionCardSkeleton />
                        <RevisionCardSkeleton />
                    </div>
                </div>
            </div>
        </main>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-slate-600 mb-4">{message}</p>
                <Link
                    href="/check"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                    새 분석하기
                </Link>
            </div>
        </main>
    );
}
