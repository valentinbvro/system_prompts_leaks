import { marked } from 'marked';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { askAboutDocument } from '../lib/ai';
import { clearMessages, listMessages, saveMessages } from '../lib/docs';
import type { ChatMessage } from '../lib/types';
import { Icon } from './Icon';

interface Props {
  documentId: string;
  title: string;
  getDocumentText: () => string;
  selectedText: string;
  onInsert: (markdown: string) => void;
  onClose: () => void;
}

const SUGGESTIONS = [
  'Summarize this document',
  'List the key points and action items',
  'Suggest a better title',
  'Proofread and point out unclear sentences',
];

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Model output is rendered as Markdown; any raw HTML it contains is shown as text.
marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    html: ({ text }) => escapeHtml(text),
    link({ href, text }) {
      if (!/^(https?:|mailto:)/i.test(href)) return escapeHtml(text);
      return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
    },
    image: ({ text }) => escapeHtml(text),
  },
});

function Markdown({ text }: { text: string }) {
  const html = marked.parse(text, { async: false }) as string;
  return <div className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function AskAIPanel({ documentId, title, getDocumentText, selectedText, onInsert, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listMessages(documentId).then(setMessages).catch(() => setMessages([]));
    inputRef.current?.focus();
    return () => abortRef.current?.abort();
  }, [documentId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, streaming]);

  const busy = streaming !== null;

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setError(null);
    setDraft('');

    const content = selectedText
      ? `${question}\n\n(Selected text in the document:)\n"""${selectedText}"""`
      : question;
    const userMsg: ChatMessage = { role: 'user', content };
    const history = [...messages, userMsg];
    setMessages(history);
    setStreaming('');

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const answer = await askAboutDocument({
        title,
        documentText: getDocumentText(),
        history,
        onDelta: setStreaming,
        signal: ctrl.signal,
      });
      const assistantMsg: ChatMessage = { role: 'assistant', content: answer || '_(no response)_' };
      setMessages([...history, assistantMsg]);
      saveMessages(documentId, [userMsg, assistantMsg]).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The AI request failed.');
      setMessages(history);
    } finally {
      setStreaming(null);
      abortRef.current = null;
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(draft);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(draft);
    }
  }

  async function reset() {
    abortRef.current?.abort();
    setMessages([]);
    await clearMessages(documentId).catch(() => {});
  }

  return (
    <aside className="ai-panel" aria-label="Ask AI">
      <header className="ai-head">
        <div className="ai-title">
          <Icon name="sparkle" size={20} className="ai-spark" />
          Ask AI
          <span className="ai-model">GPT-4o</span>
        </div>
        <div className="ai-actions">
          <button className="icon-btn" title="New chat" aria-label="New chat" onClick={reset} disabled={busy}>
            <Icon name="refresh" size={18} />
          </button>
          <button className="icon-btn" title="Close" aria-label="Close" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>
      </header>

      <div className="ai-body" ref={scrollRef}>
        {messages.length === 0 && !busy && (
          <div className="ai-empty">
            <div className="ai-hello">Hi! Ask me anything about “{title || 'Untitled document'}”.</div>
            <div className="ai-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="chip" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={m.id ?? i} className={`msg ${m.role}`}>
            {m.role === 'assistant' ? (
              <>
                <Markdown text={m.content} />
                <div className="msg-tools">
                  <button className="text-btn" onClick={() => navigator.clipboard.writeText(m.content)}>
                    <Icon name="copy" size={16} /> Copy
                  </button>
                  <button className="text-btn" onClick={() => onInsert(m.content)}>
                    <Icon name="insert" size={16} /> Insert into doc
                  </button>
                </div>
              </>
            ) : (
              <div className="bubble">{m.content}</div>
            )}
          </div>
        ))}

        {busy && (
          <div className="msg assistant">
            {streaming ? <Markdown text={streaming} /> : <div className="typing"><span /><span /><span /></div>}
          </div>
        )}

        {error && <div className="ai-error">{error}</div>}
      </div>

      <form className="ai-input" onSubmit={onSubmit}>
        {selectedText && (
          <div className="ai-selection" title={selectedText}>
            Using selection: “{selectedText.slice(0, 80)}
            {selectedText.length > 80 ? '…' : ''}”
          </div>
        )}
        <div className="ai-input-row">
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            placeholder="Ask about this document…"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
          />
          {busy ? (
            <button type="button" className="send-btn" aria-label="Stop" onClick={() => abortRef.current?.abort()}>
              <Icon name="stop" size={18} />
            </button>
          ) : (
            <button type="submit" className="send-btn" aria-label="Send" disabled={!draft.trim()}>
              <Icon name="send" size={18} />
            </button>
          )}
        </div>
        <div className="ai-disclaimer">AI responses may be inaccurate. Check important info.</div>
      </form>
    </aside>
  );
}
