-- Fit Concierge conversation logs
create table public.fit_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  messages jsonb not null,
  summary text,
  share_enabled boolean default false,
  created_at timestamptz default now()
);

alter table public.fit_conversations enable row level security;

-- Authenticated users can read their own conversations
create policy "Users read own conversations"
  on public.fit_conversations for select
  using (auth.uid() = user_id);

create index fit_conversations_user_id_idx on public.fit_conversations (user_id);
