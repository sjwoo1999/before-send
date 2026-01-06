-- =====================================================
-- Before Send (보내기 전에) - Database Schema
-- =====================================================

-- Message Checks Table
-- Stores all message analysis results
create table if not exists message_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  situation text,
  original_message text not null,
  tone_label text not null,
  risk_level text not null default 'medium',
  problem_summary text not null,
  highlighted_words jsonb not null default '[]'::jsonb,
  revised_soft text not null,
  revised_neutral text not null,
  revised_assertive text not null,
  selected_tone text,
  prompt_version text not null default 'v1',
  created_at timestamptz not null default now()
);

-- Index for efficient user history queries
create index if not exists idx_message_checks_user_id_created_at
  on message_checks (user_id, created_at desc);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on the table
alter table message_checks enable row level security;

-- Policy: Users can only view their own checks
create policy "Users can view own checks" 
  on message_checks 
  for select 
  using (auth.uid() = user_id);

-- Policy: Users can only insert their own checks
create policy "Users can insert own checks" 
  on message_checks 
  for insert 
  with check (auth.uid() = user_id);

-- Policy: Users can only delete their own checks
create policy "Users can delete own checks" 
  on message_checks 
  for delete 
  using (auth.uid() = user_id);

-- Note: No update policy - checks are immutable once created

-- =====================================================
-- Comments for documentation
-- =====================================================

comment on table message_checks is 'Stores message tone analysis results and revisions';
comment on column message_checks.tone_label is 'aggressive, defensive, passive_aggressive, neutral';
comment on column message_checks.risk_level is 'high, medium, low';
comment on column message_checks.highlighted_words is 'Array of {start, end, type, token} objects';
comment on column message_checks.prompt_version is 'Version of the AI prompt used for analysis';
