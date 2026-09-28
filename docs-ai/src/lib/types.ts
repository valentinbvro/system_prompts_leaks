import type { JSONContent } from '@tiptap/react';

export interface DocRow {
  id: string;
  owner_id: string;
  title: string;
  content: JSONContent;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}
