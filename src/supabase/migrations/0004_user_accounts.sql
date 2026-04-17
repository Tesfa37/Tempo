-- src/supabase/migrations/0004_user_accounts.sql

-- 1. account_type: 'individual' | 'caregiver' | 'agency'
alter table public.profiles
  add column if not exists account_type text
  default 'individual'
  constraint profiles_account_type_check
  check (account_type in ('individual', 'caregiver', 'agency'));

-- 2. care_recipients: array of {id, display_name, conditions, sizes, notes, saved_items}
alter table public.profiles
  add column if not exists care_recipients jsonb default '[]'::jsonb;

-- 3. fit_profile: individual user's sizes + conditions (stored only for account_type='individual')
alter table public.profiles
  add column if not exists fit_profile jsonb default null;
-- shape: {top: string, bottom: string, shoe: string, conditions: string[], notes: string}

-- 4. agency_settings: facility name + bulk/invoicing prefs (account_type='agency')
alter table public.profiles
  add column if not exists agency_settings jsonb default null;
-- shape: {facility_name: string, bulk_order: boolean, net30: boolean}

-- 5. email_preferences: opt-in/out per category
alter table public.profiles
  add column if not exists email_preferences jsonb
  default '{"marketing": true, "order_updates": true, "point_alerts": true}'::jsonb;

-- 6. deleted_at: soft delete, 30-day recovery window
alter table public.profiles
  add column if not exists deleted_at timestamptz default null;

-- 7. Migrate existing caregiver_mode=true rows to account_type='caregiver'
-- Guard on account_type = 'individual' prevents clobbering any manually-set values on re-run.
update public.profiles
  set account_type = 'caregiver'
  where caregiver_mode = true
    and account_type = 'individual';

-- 8. Partial index for soft-delete queries (WHERE deleted_at IS NULL is the hot path)
create index if not exists profiles_deleted_at_idx
  on public.profiles (deleted_at)
  where deleted_at is not null;
