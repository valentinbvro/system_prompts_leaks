-- Docs AI — InsForge schema
-- Run once in the InsForge dashboard SQL editor (or `insforge db query` with the CLI).
-- Every row is owned by the signed-in user; RLS keeps documents private.

create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null default 'Untitled document',
  content     jsonb not null default '{}'::jsonb,   -- Tiptap/ProseMirror JSON
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists documents_owner_updated_idx
  on public.documents (owner_id, updated_at desc);

create table if not exists public.ai_messages (
  id           uuid primary key default gen_random_uuid(),
  document_id  uuid not null references public.documents (id) on delete cascade,
  owner_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  role         text not null check (role in ('user', 'assistant')),
  content      text not null,
  created_at   timestamptz not null default now()
);

create index if not exists ai_messages_document_idx
  on public.ai_messages (document_id, created_at);

-- Keep updated_at fresh on every edit.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists documents_touch_updated_at on public.documents;
create trigger documents_touch_updated_at
  before update on public.documents
  for each row execute function public.touch_updated_at();

-- Row level security: users only ever see their own rows.
alter table public.documents   enable row level security;
alter table public.ai_messages enable row level security;

drop policy if exists documents_owner_all on public.documents;
create policy documents_owner_all on public.documents
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists ai_messages_owner_all on public.ai_messages;
create policy ai_messages_owner_all on public.ai_messages
  for all to authenticated
  using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.documents d
      where d.id = document_id and d.owner_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.documents   to authenticated;
grant select, insert, update, delete on public.ai_messages to authenticated;
