import type { JSONContent } from '@tiptap/react';
import { insforge } from './insforge';
import type { ChatMessage, DocRow } from './types';

const db = () => insforge.database;

export async function listDocs(): Promise<DocRow[]> {
  const { data, error } = await db()
    .from('documents')
    .select('id, owner_id, title, content, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as DocRow[];
}

export async function getDoc(id: string): Promise<DocRow> {
  const { data, error } = await db().from('documents').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data as DocRow;
}

export async function createDoc(title = 'Untitled document', content: JSONContent = { type: 'doc', content: [] }) {
  const { data, error } = await db().from('documents').insert({ title, content }).select().single();
  if (error) throw new Error(error.message);
  return data as DocRow;
}

export async function updateDoc(id: string, patch: Partial<Pick<DocRow, 'title' | 'content'>>) {
  const { error } = await db().from('documents').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteDoc(id: string) {
  const { error } = await db().from('documents').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listMessages(documentId: string): Promise<ChatMessage[]> {
  const { data, error } = await db()
    .from('ai_messages')
    .select('id, role, content')
    .eq('document_id', documentId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as ChatMessage[];
}

export async function saveMessages(documentId: string, messages: ChatMessage[]) {
  const rows = messages.map((m) => ({ document_id: documentId, role: m.role, content: m.content }));
  const { error } = await db().from('ai_messages').insert(rows);
  if (error) throw new Error(error.message);
}

export async function clearMessages(documentId: string) {
  const { error } = await db().from('ai_messages').delete().eq('document_id', documentId);
  if (error) throw new Error(error.message);
}
