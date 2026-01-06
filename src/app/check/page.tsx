'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Send, Lock } from 'lucide-react';
import Link from 'next/link';
import { ToneSelector } from '@/components/ui/ToneSelector';

const MAX_SITUATION_LENGTH = 100;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 500;

// Demo data for mock mode
const DEMO_SITUATION = '연인에게 보내는 메시지';
const DEMO_MESSAGE = '너 왜 맨날 그 모양이야? 진짜 한심하다. 도대체 언제까지 이럴 거야? 나 이제 진짜 지쳤어.';

export default function CheckPage() {
    const router = useRouter();

    // Check if mock mode is enabled
    const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

    // In mock mode, use demo data and make it read-only
    const [situation, setSituation] = useState(isMockMode ? DEMO_SITUATION : '');
    const [originalMessage, setOriginalMessage] = useState(isMockMode ? DEMO_MESSAGE : '');
    const [preferredTone, setPreferredTone] = useState<'soft' | 'neutral' | 'assertive' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const messageLength = originalMessage.length;
    const isValid = messageLength >= MIN_MESSAGE_LENGTH && messageLength <= MAX_MESSAGE_LENGTH;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isValid) {
            setError(`메시지는 ${MIN_MESSAGE_LENGTH}자 이상 ${MAX_MESSAGE_LENGTH}자 이하여야 합니다.`);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    situation: situation.trim() || null,
                    original_message: originalMessage.trim(),
                    preferred_tone: preferredTone,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    setError('하루 무료 사용량을 초과했습니다. 내일 다시 시도해 주세요.');
                } else if (response.status === 400 && data.blocked) {
                    setError(data.message || '이 메시지는 분석할 수 없습니다.');
                } else {
                    setError(data.message || '오류가 발생했습니다. 다시 시도해 주세요.');
                }
                return;
            }

            // Redirect to result page
            router.push(`/check/result/${data.id}`);
        } catch {
            setError('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <h1 className="text-h2 text-slate-900">메시지 분석</h1>
                </div>
            </header>

            {/* Demo Mode Banner */}
            {isMockMode && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
                    <p className="max-w-2xl mx-auto text-sm text-amber-800 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span><strong>데모 모드:</strong> 예시 메시지가 미리 입력되어 있습니다. 버튼을 눌러 분석 결과를 확인하세요.</span>
                    </p>
                </div>
            )}

            {/* Form */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Situation (Optional) */}
                    <div>
                        <label htmlFor="situation" className="block text-sm font-medium text-slate-700 mb-2">
                            상황 설명 <span className="text-slate-400">(선택)</span>
                        </label>
                        <input
                            id="situation"
                            type="text"
                            value={situation}
                            onChange={(e) => !isMockMode && setSituation(e.target.value.slice(0, MAX_SITUATION_LENGTH))}
                            placeholder="예: 상사에게 보내는 답장"
                            className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition-shadow ${isMockMode
                                    ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
                                    : 'bg-white border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                }`}
                            maxLength={MAX_SITUATION_LENGTH}
                            readOnly={isMockMode}
                        />
                        {!isMockMode && (
                            <p className="text-caption mt-1 text-right">
                                {situation.length}/{MAX_SITUATION_LENGTH}
                            </p>
                        )}
                    </div>

                    {/* Original Message (Required) */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                            분석할 메시지 <span className="text-red-500">*</span>
                            {isMockMode && <span className="ml-2 text-xs text-amber-600">(데모 예시)</span>}
                        </label>
                        <textarea
                            id="message"
                            value={originalMessage}
                            onChange={(e) => !isMockMode && setOriginalMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                            placeholder="보내려는 메시지를 붙여넣기하세요..."
                            rows={6}
                            className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition-shadow resize-none ${isMockMode
                                    ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
                                    : 'bg-white border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                                }`}
                            maxLength={MAX_MESSAGE_LENGTH}
                            required
                            readOnly={isMockMode}
                        />
                        {!isMockMode && (
                            <div className="flex justify-between items-center mt-1">
                                <p className={`text-xs ${messageLength < MIN_MESSAGE_LENGTH ? 'text-amber-600' : 'text-slate-500'}`}>
                                    {messageLength < MIN_MESSAGE_LENGTH && `최소 ${MIN_MESSAGE_LENGTH}자 이상 입력해 주세요`}
                                </p>
                                <p className={`text-caption ${messageLength > MAX_MESSAGE_LENGTH * 0.9 ? 'text-amber-600' : ''}`}>
                                    {messageLength}/{MAX_MESSAGE_LENGTH}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tone Selector (Optional) - hidden in mock mode for simplicity */}
                    {!isMockMode && (
                        <ToneSelector value={preferredTone} onChange={setPreferredTone} />
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-teal-500/25 focus-ring"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                분석 중...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                {isMockMode ? '데모 분석하기' : '분석하기'}
                            </>
                        )}
                    </button>
                </form>

                {/* Info */}
                <div className="mt-8 p-4 bg-slate-100 rounded-xl">
                    <p className="text-caption text-center">
                        {isMockMode
                            ? '🧪 데모 모드에서는 실제 AI 분석 없이 시뮬레이션된 결과를 보여드립니다.'
                            : '분석 결과는 약 3-5초 후에 확인할 수 있어요.'
                        }
                    </p>
                </div>
            </div>
        </main>
    );
}
