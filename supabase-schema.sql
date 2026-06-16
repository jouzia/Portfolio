-- ════════════════════════════════════════════════════════════════
-- Jouzia Afreen H — Portfolio Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ════════════════════════════════════════════════════════════════

-- 1. PROJECTS TABLE
create table if not exists projects (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now(),
  title       text         not null,
  description text         not null,
  tags        text[]       default '{}',
  live_url    text,
  doc_url     text,
  is_featured boolean      default false
);

-- 2. CERTIFICATES TABLE
create table if not exists certificates (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now(),
  title       text        not null,
  issuer      text        not null,
  date        date,
  pdf_url     text        not null
);

-- 3. ENABLE ROW LEVEL SECURITY
alter table projects    enable row level security;
alter table certificates enable row level security;

-- 4. PUBLIC READ POLICY (portfolio visitors can read)
create policy "Public read projects"
  on projects for select using (true);

create policy "Public read certificates"
  on certificates for select using (true);

-- 5. AUTHENTICATED WRITE POLICY (only Jouzia can write)
create policy "Auth write projects"
  on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Auth write certificates"
  on certificates for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════════
-- 6. STORAGE BUCKET
-- Go to: Storage → New bucket → Name: "certificates"
-- Visibility: Public (so PDF links work without auth)
-- ════════════════════════════════════════════════════════════════
