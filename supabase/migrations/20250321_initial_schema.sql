-- Enable les extensions nécessaires
create extension if not exists "uuid-ossp";

-- Création des tables principales
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  type varchar(20) check (type in ('freelance', 'company')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text,
  avatar_url text,
  website text,
  company_name text,
  company_size text,
  industry text,
  location text,
  constraint profiles_id_key unique (id)
);

create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  company_id uuid references public.profiles(id) on delete cascade not null,
  budget_min integer,
  budget_max integer,
  duration text,
  status text check (status in ('draft', 'published', 'in_progress', 'completed', 'cancelled')) default 'draft',
  skills text[]
);

create table public.missions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  freelance_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected', 'completed')) default 'pending',
  proposal_text text,
  rate numeric(10,2),
  start_date date,
  end_date date
);

create table public.invoices (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  mission_id uuid references public.missions(id) on delete cascade not null,
  amount numeric(10,2) not null,
  status text check (status in ('draft', 'sent', 'paid', 'cancelled')) default 'draft',
  due_date date,
  paid_at timestamp with time zone,
  invoice_number text,
  stripe_payment_intent_id text
);

-- Création des vues
create view public.freelance_missions as
select 
  m.*,
  p.title as project_title,
  p.company_id,
  prof.company_name
from missions m
join projects p on m.project_id = p.id
join profiles prof on p.company_id = prof.id;

create view public.company_projects as
select 
  p.*,
  count(distinct m.id) as applications_count,
  count(distinct case when m.status = 'accepted' then m.id end) as hired_count
from projects p
left join missions m on p.id = m.project_id
group by p.id;

-- Configuration RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.missions enable row level security;
alter table public.invoices enable row level security;

-- Policies
create policy "Les profils sont visibles par tous les utilisateurs authentifiés"
on public.profiles for select
to authenticated
using (true);

create policy "Les utilisateurs peuvent modifier leur propre profil"
on public.profiles for update
to authenticated
using (auth.uid() = id);

create policy "Les projets publiés sont visibles par tous les utilisateurs authentifiés"
on public.projects for select
to authenticated
using (status = 'published' or company_id = auth.uid());

create policy "Les entreprises peuvent créer des projets"
on public.projects for insert
to authenticated
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid()
    and type = 'company'
  )
);

create policy "Les entreprises peuvent modifier leurs propres projets"
on public.projects for update
to authenticated
using (company_id = auth.uid());

-- Triggers pour updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_projects_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at();

create trigger handle_missions_updated_at
  before update on public.missions
  for each row
  execute function public.handle_updated_at();

create trigger handle_invoices_updated_at
  before update on public.invoices
  for each row
  execute function public.handle_updated_at();
