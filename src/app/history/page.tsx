'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { ToneBadge } from '@/components/ui/ToneBadge';
import type { HistoryItem, ToneLabel } from '@/lib/schema';

export default function HistoryPage() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        try {
            const response = await fetch('/api/history');

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return;
                }
                setError('기록을 불러오는데 실패했습니다.');
                return;
            }

            const data = await response.json();
            setItems(data.items || []);
        } catch {
            setError('네트워크 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('이 분석 기록을 삭제하시겠습니까?')) return;

        setDeletingId(id);
        try {
            const response = await fetch(`/api/check/${id}`, { method: 'DELETE' });

            if (response.ok) {
                setItems(items.filter(item => item.id !== id));
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch {
            alert('네트워크 오류가 발생했습니다.');
        } finally {
            setDeletingId(null);
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-10">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Link
                        href="/"
                        className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="홈으로"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <h1 className="text-h2 text-slate-900">분석 기록</h1>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-6">
                {isLoading ? (
                    <LoadingState />
                ) : error ? (
                    <ErrorState message={error} />
                ) : items.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:border-slate-300 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <Link href={`/check/result/${item.id}`} className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ToneBadge tone={item.tone_label as ToneLabel} size="sm" />
                                            <span className="text-caption">{formatDate(item.created_at)}</span>
                                        </div>
                                        <p className="text-body text-slate-700 truncate">
                                            {item.original_snippet}
                                        </p>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deletingId === item.id}
                                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                        aria-label="삭제"
                                    >
                                        {deletingId === item.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* New Analysis CTA */}
                <div className="mt-8">
                    <Link
                        href="/check"
                        className="block w-full py-3 text-center font-medium text-white bg-teal-500 rounded-xl hover:bg-teal-600 transition-colors"
                    >
                        새 메시지 분석
                    </Link>
                </div>
            </div>
        </main>
    );
}

function LoadingState() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="skeleton h-5 w-16" />
                        <div className="skeleton h-4 w-20" />
                    </div>
                    <div className="skeleton h-4 w-full" />
                </div>
            ))}
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="text-center py-12">
            <p className="text-slate-600 mb-4">{message}</p>
            <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
                로그인하기
            </Link>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-12">
            <p className="text-slate-500 mb-2">저장된 분석 기록이 없습니다.</p>
            <p className="text-caption">메시지를 분석하면 여기에 기록이 저장됩니다.</p>
        </div>
    );
}
