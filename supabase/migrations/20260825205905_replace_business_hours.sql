create function public.replace_business_hours(
  p_business_id uuid,
  p_schedules jsonb
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  schedule_count integer;
  distinct_day_count integer;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1
    from public.businesses
    where businesses.id = p_business_id
      and businesses.owner_id = (select auth.uid())
  ) then
    raise exception 'Business not found or not owned by user';
  end if;

  if jsonb_typeof(p_schedules) <> 'array' then
    raise exception 'Schedules must be an array';
  end if;

  select count(*), count(distinct schedule.day_of_week)
  into schedule_count, distinct_day_count
  from jsonb_to_recordset(p_schedules) as schedule(
    day_of_week smallint,
    opens_at time,
    closes_at time,
    is_closed boolean
  );

  if schedule_count <> 7 or distinct_day_count <> 7 then
    raise exception 'Exactly one schedule is required for each weekday';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_schedules) as schedule(
      day_of_week smallint,
      opens_at time,
      closes_at time,
      is_closed boolean
    )
    where schedule.day_of_week not between 0 and 6
      or schedule.is_closed is null
      or (
        schedule.is_closed
        and (schedule.opens_at is not null or schedule.closes_at is not null)
      )
      or (
        not schedule.is_closed
        and (
          schedule.opens_at is null
          or schedule.closes_at is null
          or schedule.opens_at >= schedule.closes_at
        )
      )
  ) then
    raise exception 'Invalid business schedule';
  end if;

  delete from public.business_hours
  where business_hours.business_id = p_business_id;

  insert into public.business_hours (
    business_id,
    day_of_week,
    opens_at,
    closes_at,
    is_closed
  )
  select
    p_business_id,
    schedule.day_of_week,
    schedule.opens_at,
    schedule.closes_at,
    schedule.is_closed
  from jsonb_to_recordset(p_schedules) as schedule(
    day_of_week smallint,
    opens_at time,
    closes_at time,
    is_closed boolean
  );
end;
$$;

comment on function public.replace_business_hours(uuid, jsonb) is
  'Reemplaza atómicamente el horario semanal de un negocio propiedad del usuario autenticado.';

revoke all on function public.replace_business_hours(uuid, jsonb)
from public, anon;
grant execute on function public.replace_business_hours(uuid, jsonb)
to authenticated;
