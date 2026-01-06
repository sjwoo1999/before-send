import Link from 'next/link';
import { ArrowRight, Shield, MessageSquareWarning, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <section className="px-4 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo/Title */}
          <h1 className="text-display text-white mb-4 md:text-4xl">
            보내기 전에
          </h1>
          <p className="text-lg md:text-xl text-teal-400 font-medium mb-6">
            전송 전 마지막 체크
          </p>
          <p className="text-slate-300 text-body md:text-base mb-8 max-w-md mx-auto">
            감정적 메시지를 보내기 전에 톤을 분석하고,<br />
            관계를 망치지 않는 3가지 수정안을 받아보세요.
          </p>

          {/* CTA Button */}
          <Link
            href="/check"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/25 focus-ring"
          >
            메시지 분석하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h2 text-white text-center mb-8">
            후회 보내는 메시지 줄이기
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4">
                <MessageSquareWarning className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">톤 분석</h3>
              <p className="text-sm text-slate-400">
                공격적, 방어적, 수동공격적 표현을 자동으로 감지하고 위험 수준을 알려드려요.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">문제 표현 하이라이트</h3>
              <p className="text-sm text-slate-400">
                비난, 일반화, 모욕 등 관계를 해칠 수 있는 표현을 정확히 짚어드려요.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">3가지 수정안</h3>
              <p className="text-sm text-slate-400">
                부드럽게, 중립, 단호하게 - 상황에 맞는 수정안을 선택해 바로 복사하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-12 md:py-16 bg-slate-800/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-h2 text-white mb-6">이런 분들께 추천해요</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              '상사에게 답장 보낼 때',
              '연인과 갈등 중일 때',
              '댓글 달기 전에',
              '중요한 DM 보낼 때',
              '감정이 격해진 순간',
            ].map((useCase) => (
              <span
                key={useCase}
                className="px-4 py-2 bg-slate-700/50 rounded-full text-sm text-slate-300 border border-slate-600"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-md mx-auto text-center">
          <p className="text-slate-400 mb-4">
            30초 안에 결과를 받아보세요
          </p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/25 focus-ring"
          >
            지금 시작하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-caption text-slate-500 mb-2">
            이 서비스는 관계 조언을 제공하지 않습니다.
          </p>
          <p className="text-caption text-slate-600">
            심각한 갈등 상황에서는 전문가 상담을 권장합니다.
          </p>
        </div>
      </footer>
    </main>
  );
}
