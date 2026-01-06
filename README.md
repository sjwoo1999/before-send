# 보내기 전에 (Before Send)

감정적 메시지를 보내기 전에 톤을 분석하고, 관계를 망치지 않는 3가지 수정안을 제공하는 AI 서비스

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Supabase account
- Anthropic Claude API key

### Installation

```bash
# Clone and install
git clone <repo-url>
cd before-send
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run Supabase migration
# Apply supabase/migrations/001_message_checks.sql to your Supabase project

# Start development server
npm run dev
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── check/
│   │   ├── page.tsx                # Input form
│   │   └── result/[id]/page.tsx    # Analysis result
│   ├── history/page.tsx            # Saved checks
│   └── api/
│       ├── check/route.ts          # POST: create check
│       ├── check/[id]/route.ts     # GET/DELETE: check by ID
│       └── history/route.ts        # GET: user's history
├── components/
│   ├── ui/                         # Atomic components
│   ├── ComparisonView.tsx          # Before/after comparison
│   └── MoodRxCta.tsx               # Mood Rx integration CTA
└── lib/
    ├── claude.ts                   # AI client
    ├── schema.ts                   # Zod schemas
    ├── safety.ts                   # Content filtering
    ├── rateLimit.ts                # 3/day limit
    └── supabase/                   # DB clients
```

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role (server only) |
| `CLAUDE_API_KEY` | ✅ | Anthropic Claude API key |
| `RATE_LIMIT_REDIS_URL` | ❌ | Upstash Redis (optional) |

## 📊 Database Setup

Run the migration in `supabase/migrations/001_message_checks.sql` which creates:
- `message_checks` table with RLS policies
- Owner-only access (select, insert, delete)

## 🎨 Design System

- **Primary**: Navy (#0B1220)
- **Accent**: Teal (#19C2A0)
- **Fonts**: Pretendard + Inter

### Tone Badges
- Aggressive (Red), Defensive (Amber), Passive Aggressive (Purple), Neutral (Green)

### Revision Cards
- Soft (Teal), Neutral (Slate), Assertive (Blue)

## 🚢 Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## 📋 Rate Limiting

- Free tier: 3 checks/day
- Uses Upstash Redis if configured, otherwise in-memory

## ⚠️ Safety

- Keyword pre-check for harmful content
- AI-level blocking for manipulation/threats
- Disclaimer on all pages

---

Built with Next.js 14, Tailwind CSS, Supabase, and Claude AI.
