-- Remote Job Copilot core schema (PostgreSQL)

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  preferred_titles text[] not null default '{}',
  preferred_locations text[] not null default '{}',
  preferred_industries text[] not null default '{}',
  skills text[] not null default '{}',
  remote_preference text not null default 'remote_or_hybrid' check (remote_preference in ('fully_remote','remote_or_hybrid','any')),
  prioritize_fully_remote boolean not null default false,
  salary_target_min integer,
  salary_target_max integer,
  experience_level text check (experience_level in ('intern','junior','mid','senior','staff','principal','manager','director','executive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists job_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  source_type text not null default 'manual' check (source_type in ('manual','url_paste','text_paste','browser_extension','api_connector','ats_connector')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  source_url text,
  source_name text,
  source_id uuid references job_sources(id) on delete set null,
  raw_job_text text,
  cleaned_job_text text,
  title text not null,
  company text not null,
  location text,
  normalized_location text,
  remote_type text not null default 'unknown' check (remote_type in ('remote','hybrid','onsite','unknown')),
  salary_min integer,
  salary_max integer,
  currency text default 'USD',
  benefits_summary text,
  posted_date date,
  ingestion_date timestamptz not null default now(),
  last_checked_date timestamptz,
  fit_score numeric(5,2),
  fit_reasoning text,
  duplicate_group_id uuid,
  parser_confidence numeric(4,3),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_jobs_source_url on jobs(source_url);
create index if not exists idx_jobs_company_title on jobs(company, title);
create index if not exists idx_jobs_duplicate_group_id on jobs(duplicate_group_id);

create table if not exists saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  notes text,
  saved_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  status text not null check (status in ('saved','planned','applied','interview','offer','rejected','withdrawn')),
  applied_at timestamptz,
  external_application_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create table if not exists application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references job_applications(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_at timestamptz not null default now(),
  reason text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  raw_text text,
  structured_data jsonb not null default '{}'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists generated_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  job_id uuid references jobs(id) on delete set null,
  resume_id uuid references resumes(id) on delete set null,
  doc_type text not null check (doc_type in ('resume_tailored','cover_letter')),
  tone text,
  content text not null,
  model_provider text,
  model_name text,
  prompt_version text,
  generation_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists generated_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  job_id uuid references jobs(id) on delete set null,
  question text not null,
  answer text not null,
  tone text,
  model_provider text,
  model_name text,
  prompt_version text,
  generation_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists follow_up_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  application_id uuid references job_applications(id) on delete cascade,
  reminder_date timestamptz not null,
  reminder_type text not null default 'follow_up',
  status text not null default 'pending' check (status in ('pending','sent','dismissed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
