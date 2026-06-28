-- AURA - Esquema real de base de datos
-- Ejecutar completo en Supabase SQL Editor

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

create table posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade,
  content text not null,
  image_url text,
  created_at timestamptz default now()
);

create table ecos (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade,
  parent_id uuid references ecos(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

-- Seguridad: cada usuario solo controla sus propios datos
alter table profiles enable row level security;
alter table posts enable row level security;
alter table ecos enable row level security;
alter table follows enable row level security;

create policy "perfiles visibles para todos" on profiles for select using (true);
create policy "el usuario edita su perfil" on profiles for update using (auth.uid() = id);
create policy "el usuario crea su perfil" on profiles for insert with check (auth.uid() = id);

create policy "posts visibles para todos" on posts for select using (true);
create policy "el usuario crea sus posts" on posts for insert with check (auth.uid() = author_id);
create policy "el usuario borra sus posts" on posts for delete using (auth.uid() = author_id);

create policy "ecos visibles para todos" on ecos for select using (true);
create policy "el usuario crea sus ecos" on ecos for insert with check (auth.uid() = author_id);
create policy "el usuario borra sus ecos" on ecos for delete using (auth.uid() = author_id);

create policy "follows visibles para todos" on follows for select using (true);
create policy "el usuario sigue desde su cuenta" on follows for insert with check (auth.uid() = follower_id);
create policy "el usuario deja de seguir desde su cuenta" on follows for delete using (auth.uid() = follower_id);
