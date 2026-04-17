-- Atomic point increment (prevents TOCTOU under concurrent awards)
create or replace function public.increment_user_points(
  p_user_id uuid,
  p_amount  integer
) returns integer
language plpgsql
security definer set search_path = ''
as $$
declare
  v_points integer;
begin
  update public.profiles
    set points = points + p_amount
    where id = p_user_id
    returning points into v_points;
  return v_points;
end;
$$;
