-- Profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  display_name text,
  tier text default 'Advocate' check (tier in ('Advocate', 'Advisor', 'Architect')),
  points integer default 0 check (points >= 0),
  caregiver_mode boolean default false,
  public_leaderboard boolean default false,
  created_at timestamptz default now()
);

-- Point events
create table public.point_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  event_type text not null,
  points integer not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Unique partial index: one scan_dpp award per user per SKU
create unique index point_events_scan_dpp_unique
  on public.point_events (user_id, (metadata->>'sku'))
  where event_type = 'scan_dpp';

-- Indexes for common query patterns
create index point_events_user_id_idx on public.point_events (user_id);
create index redemptions_user_id_idx on public.redemptions (user_id);

-- Redemptions
create table public.redemptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  reward_type text not null,
  points_spent integer not null,
  fulfilled boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.point_events enable row level security;
alter table public.redemptions enable row level security;

create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users read own events"
  on public.point_events for select using (auth.uid() = user_id);
create policy "Users read own redemptions"
  on public.redemptions for select using (auth.uid() = user_id);

-- INSERT policies intentionally omitted for point_events and redemptions.
-- All point mutations go through server actions using createServiceClient()
-- (SUPABASE_SERVICE_ROLE_KEY), which bypasses RLS entirely. This is safe
-- because the service role key never reaches the browser.

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atomic point decrement for redemptions (prevents double-spend)
create or replace function public.decrement_points_if_sufficient(
  p_user_id uuid,
  p_amount integer
) returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  current_points integer;
begin
  select points into current_points
  from public.profiles
  where id = p_user_id
  for update;

  if current_points is null or current_points < p_amount then
    return false;
  end if;

  update public.profiles
    set points = points - p_amount
    where id = p_user_id;

  return true;
end;
$$;
