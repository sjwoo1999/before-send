# 📨 보내기 전에 (Before Send)

<div align="center">

**감정적 메시지를 보내기 전, AI가 톤을 분석하고 관계를 지키는 수정안을 제안합니다**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Claude AI](https://img.shields.io/badge/Claude-AI-orange)](https://www.anthropic.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)

[서비스 시작하기](#-quick-start) • [기능 소개](#-features) • [기술 스택](#-tech-stack)

</div>

---

## 💡 왜 만들었나요?

> "보내고 나서 후회한 메시지, 얼마나 있으세요?"

분노, 서운함, 억울함... 감정이 격해진 순간 보낸 메시지 한 통이 소중한 관계를 망가뜨리기도 합니다.

**보내기 전에**는 전송 버튼을 누르기 전, 잠깐 멈추고 생각할 수 있는 기회를 제공합니다.

---

## ✨ Features

### 🔍 톤 분석
AI가 메시지의 전체적인 톤을 분석합니다.
- **공격적 (Aggressive)** - 직접적인 비난이나 공격
- **방어적 (Defensive)** - 자기 방어적 표현
- **수동공격적 (Passive Aggressive)** - 은근한 비꼬기
- **중립적 (Neutral)** - 감정이 절제된 표현

### ⚠️ 문제 표현 하이라이트
관계를 해칠 수 있는 표현을 정확히 짚어드립니다.
- 비난 (Blame)
- 일반화 ("항상", "절대", "매번")
- 모욕 (Insult)
- 협박 (Threat)
- 비꼬기 (Sarcasm)
- 최후통첩 (Ultimatum)

### 📝 3가지 수정안
상황에 맞는 3가지 톤의 대안을 제공합니다.
- **부드럽게** - 감정을 누그러뜨린 표현
- **중립** - 객관적이고 사실 중심
- **단호하게** - 명확하지만 존중하는 표현

---

## 🎯 이런 분들께 추천해요

| 상황 | 예시 |
|------|------|
| 💼 **직장** | 상사에게 불만을 표현할 때 |
| 💑 **연인** | 싸우는 중 답장을 보낼 때 |
| 👨‍👩‍👧 **가족** | 부모님과 갈등이 생겼을 때 |
| 💬 **SNS** | 댓글을 달기 전에 |
| 📱 **DM** | 중요한 사람에게 메시지 보낼 때 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Supabase account
- Anthropic Claude API key

### Installation

```bash
# Clone the repository
git clone https://github.com/sjwoo1999/before-send.git
cd before-send

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run Supabase migration
# Apply supabase/migrations/001_message_checks.sql to your Supabase project

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, Pretendard + Inter fonts |
| **Backend** | Next.js API Routes (Serverless) |
| **Database** | Supabase (PostgreSQL + RLS) |
| **AI** | Anthropic Claude 3.5 |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # 랜딩 페이지
│   ├── check/
│   │   ├── page.tsx                # 메시지 입력 폼
│   │   └── result/[id]/page.tsx    # 분석 결과 페이지
│   ├── history/page.tsx            # 분석 히스토리
│   └── api/
│       ├── check/route.ts          # POST: 분석 요청
│       ├── check/[id]/route.ts     # GET/DELETE: 결과 조회/삭제
│       └── history/route.ts        # GET: 히스토리 조회
├── components/
│   ├── ui/                         # 재사용 UI 컴포넌트
│   ├── ComparisonView.tsx          # 원본/수정안 비교
│   └── MoodRxCta.tsx               # Mood Rx 연동 CTA
└── lib/
    ├── claude.ts                   # AI 클라이언트
    ├── schema.ts                   # Zod 스키마
    ├── safety.ts                   # 유해 콘텐츠 필터링
    ├── rateLimit.ts                # 일일 3회 제한
    └── supabase/                   # DB 클라이언트
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `CLAUDE_API_KEY` | ✅ | Anthropic Claude API key |
| `RATE_LIMIT_REDIS_URL` | ❌ | Upstash Redis (optional) |

---

## 🎨 Design System

### Colors
- **Primary**: Navy (`#0B1220`) - 신뢰와 안정감
- **Accent**: Teal (`#19C2A0`) - 안전과 치유

### Tone Badges
| Tone | Color |
|------|-------|
| Aggressive | 🔴 Red |
| Defensive | 🟠 Amber |
| Passive Aggressive | 🟣 Purple |
| Neutral | 🟢 Green |

---

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sjwoo1999/before-send)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

---

## ⚠️ Safety & Disclaimer

- 🛡️ 유해 콘텐츠 사전 필터링
- 🚫 조작/협박 의도 메시지 차단
- ⚖️ 모든 페이지에 주의 문구 표시

> **주의**: 이 서비스는 관계 조언을 제공하지 않습니다. 심각한 갈등 상황에서는 전문가 상담을 권장합니다.

---

## 📋 Rate Limiting

- Free tier: **3 checks/day** per user
- Upstash Redis 사용 시 분산 환경 지원

---

## 📄 License

MIT License © 2025 [sjwoo1999](https://github.com/sjwoo1999)

---

<div align="center">
  <sub>Built with ❤️ using Next.js, Tailwind CSS, Supabase, and Claude AI</sub>
</div>
