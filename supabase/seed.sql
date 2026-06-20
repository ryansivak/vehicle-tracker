insert into public.vehicles (
  id,
  nickname,
  year,
  make,
  model,
  vin,
  current_mileage,
  notes
) values (
  gen_random_uuid(),
  '2010 Chevy Equinox',
  2010,
  'Chevrolet',
  'Equinox',
  '2CNLFCEW9A6317537',
  94285,
  'Imported example vehicle for the clean Supabase-ready project.'
)
on conflict (vin) do nothing;
