create extension if not exists pgcrypto;

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  year integer not null,
  make text not null,
  model text not null,
  trim text not null default '',
  vin text not null unique,
  license_plate text not null default '',
  current_mileage integer not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.maintenance_logs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  service_date date not null,
  mileage integer not null default 0,
  service_type text not null,
  description text not null default '',
  cost numeric(10,2) not null default 0,
  shop text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.repairs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  repair_date date not null,
  mileage integer not null default 0,
  title text not null,
  notes text not null default '',
  labor_cost numeric(10,2) not null default 0,
  parts_cost numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.fuel_logs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  fill_date date not null,
  mileage integer not null default 0,
  gallons numeric(10,3) not null default 0,
  total_cost numeric(10,2) not null default 0,
  station text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.parts (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  part_name text not null,
  part_number text not null default '',
  quantity integer not null default 1,
  unit_cost numeric(10,2) not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  title text not null,
  file_name text not null default '',
  file_url text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  caption text not null default '',
  file_url text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  title text not null,
  due_date date,
  due_mileage integer,
  notes text not null default '',
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;
alter table public.maintenance_logs enable row level security;
alter table public.repairs enable row level security;
alter table public.fuel_logs enable row level security;
alter table public.parts enable row level security;
alter table public.documents enable row level security;
alter table public.photos enable row level security;
alter table public.reminders enable row level security;

drop policy if exists "vehicles all access" on public.vehicles;
drop policy if exists "maintenance logs all access" on public.maintenance_logs;
drop policy if exists "repairs all access" on public.repairs;
drop policy if exists "fuel logs all access" on public.fuel_logs;
drop policy if exists "parts all access" on public.parts;
drop policy if exists "documents all access" on public.documents;
drop policy if exists "photos all access" on public.photos;
drop policy if exists "reminders all access" on public.reminders;

create policy "vehicles all access" on public.vehicles for all using (true) with check (true);
create policy "maintenance logs all access" on public.maintenance_logs for all using (true) with check (true);
create policy "repairs all access" on public.repairs for all using (true) with check (true);
create policy "fuel logs all access" on public.fuel_logs for all using (true) with check (true);
create policy "parts all access" on public.parts for all using (true) with check (true);
create policy "documents all access" on public.documents for all using (true) with check (true);
create policy "photos all access" on public.photos for all using (true) with check (true);
create policy "reminders all access" on public.reminders for all using (true) with check (true);

create index if not exists maintenance_logs_vehicle_id_idx on public.maintenance_logs(vehicle_id);
create index if not exists repairs_vehicle_id_idx on public.repairs(vehicle_id);
create index if not exists fuel_logs_vehicle_id_idx on public.fuel_logs(vehicle_id);
create index if not exists parts_vehicle_id_idx on public.parts(vehicle_id);
create index if not exists documents_vehicle_id_idx on public.documents(vehicle_id);
create index if not exists photos_vehicle_id_idx on public.photos(vehicle_id);
create index if not exists reminders_vehicle_id_idx on public.reminders(vehicle_id);
