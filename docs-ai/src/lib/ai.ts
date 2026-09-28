import { AI_MODEL, insforge } from './insforge';
import type { ChatMessage } from './types';

// Keep the prompt within a sane budget for very long documents.
const MAX_DOC_CHARS = 60_000;

function systemPrompt(title: string, text: string) {
  const body = text.length > MAX_DOC_CHARS ? `${text.slice(0, MAX_DOC_CHARS)}\n\n[…document truncated…]` : text;
  return [
    'You are "Ask AI", an assistant built into a document editor, similar to Gemini in Google Docs.',
    'Answer questions about the document below, summarize it, suggest edits, rewrite passages, or draft new text on request.',
    'Base answers on the document when the question is about it, and say so when the document does not contain the answer.',
    'Reply in the same language the user writes in. Use concise Markdown (headings, lists, bold) when it helps readability.',
    '',
    `Document title: ${title || 'Untitled document'}`,
    '<document>',
    body || '(the document is empty)',
    '</document>',
  ].join('\n');
}

/**
 * Streams a GPT-4o reply through the InsForge model gateway.
 * `onDelta` receives the accumulated text as it arrives.
 */
export async function askAboutDocument(opts: {
  title: string;
  documentText: string;
  history: ChatMessage[];
  onDelta: (fullText: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const stream = await insforge.ai.chat.completions.create({
    model: AI_MODEL,
    stream: true,
    temperature: 0.4,
    messages: [
      { role: 'system', content: systemPrompt(opts.title, opts.documentText) },
      ...opts.history.map((m) => ({ role: m.role, content: m.content })),
    ],
  });

  let full = '';
  for await (const chunk of stream as AsyncIterable<{ choices: { delta?: { content?: string } }[] }>) {
    if (opts.signal?.aborted) break;
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) {
      full += delta;
      opts.onDelta(full);
    }
  }
  return full;
}
