import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY as string | undefined;

export const isConfigured = Boolean(baseUrl && anonKey);

// Created once per page load. On init the SDK also completes a pending Google
// OAuth redirect (the `insforge_code` query param) and cleans up the URL.
export const insforge = createClient({
  baseUrl: baseUrl ?? 'http://localhost:7130',
  anonKey: anonKey ?? '',
});

// Model gateway id for GPT-4o on InsForge.
export const AI_MODEL = (import.meta.env.VITE_AI_MODEL as string | undefined) ?? 'openai/gpt-4o';
