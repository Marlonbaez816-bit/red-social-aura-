-- Ejecutar en Supabase SQL Editor (además del schema.sql anterior)

create table reels (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade,
  video_url text not null,
  caption text,
  likes_count int default 0,
  created_at timestamptz default now()
);

create table reel_likes (
  reel_id uuid references reels(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (reel_id, user_id)
);

alter table reels enable row level security;
alter table reel_likes enable row level security;

create policy "reels visibles para todos" on reels for select using (true);
create policy "el usuario sube sus reels" on reels for insert with check (auth.uid() = author_id);
create policy "el usuario borra sus reels" on reels for delete using (auth.uid() = author_id);

create policy "likes visibles para todos" on reel_likes for select using (true);
create policy "el usuario da like desde su cuenta" on reel_likes for insert with check (auth.uid() = user_id);
create policy "el usuario quita su like" on reel_likes for delete using (auth.uid() = user_id);

-- Bucket de almacenamiento para los videos (ejecutar en SQL editor también)
insert into storage.buckets (id, name, public) values ('reels', 'reels', true)
on conflict (id) do nothing;

create policy "lectura publica de reels storage" on storage.objects
  for select using (bucket_id = 'reels');

create policy "usuarios autenticados suben reels storage" on storage.objects
  for insert with check (bucket_id = 'reels' and auth.role() = 'authenticated');
