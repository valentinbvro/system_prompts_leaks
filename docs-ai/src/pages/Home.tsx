import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { DocsLogo, Icon } from '../components/Icon';
import { createDoc, deleteDoc, listDocs } from '../lib/docs';
import type { DocRow } from '../lib/types';
import type { JSONContent } from '@tiptap/react';

function previewText(node: JSONContent | undefined, limit = 220): string {
  let out = '';
  const walk = (n: JSONContent) => {
    if (out.length > limit) return;
    if (n.text) out += n.text;
    n.content?.forEach(walk);
    if (n.type === 'paragraph' || n.type === 'heading') out += '\n';
  };
  if (node) walk(node);
  return out.slice(0, limit);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  return d.toDateString() === today.toDateString()
    ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export function Home() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<DocRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    listDocs().then(setDocs).catch((e: Error) => setError(e.message));
  }, []);

  const filtered = useMemo(
    () => (docs ?? []).filter((d) => d.title.toLowerCase().includes(query.trim().toLowerCase())),
    [docs, query],
  );

  async function newDoc() {
    try {
      const doc = await createDoc();
      navigate(`/d/${doc.id}`);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(id: string, title: string) {
    if (!window.confirm(`Delete “${title}”? This can't be undone.`)) return;
    await deleteDoc(id);
    setDocs((all) => all?.filter((d) => d.id !== id) ?? null);
  }

  return (
    <div className="home">
      <header className="home-bar">
        <div className="brand">
          <DocsLogo size={36} />
          <span>Docs</span>
        </div>
        <label className="search">
          <Icon name="search" />
          <input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <Avatar />
      </header>

      <section className="template-strip">
        <div className="strip-inner">
          <div className="strip-title">Start a new document</div>
          <button className="blank-tile" onClick={newDoc} aria-label="Blank document">
            <Icon name="plus" size={56} className="blank-plus" />
          </button>
          <div className="tile-label">Blank document</div>
        </div>
      </section>

      <section className="recent">
        <div className="recent-head">Recent documents</div>
        {error && <div className="banner-error">{error}</div>}
        {docs === null && !error && <div className="muted">Loading…</div>}
        {docs && filtered.length === 0 && (
          <div className="muted">{docs.length ? 'No documents match your search.' : 'No documents yet — create one above.'}</div>
        )}
        <div className="doc-grid">
          {filtered.map((d) => (
            <article key={d.id} className="doc-card" onClick={() => navigate(`/d/${d.id}`)}>
              <div className="doc-thumb">
                <div className="doc-thumb-page">{previewText(d.content)}</div>
              </div>
              <div className="doc-meta">
                <div className="doc-title">{d.title || 'Untitled document'}</div>
                <div className="doc-sub">
                  <DocsLogo size={16} />
                  <span>Opened {formatDate(d.updated_at)}</span>
                  <button
                    className="icon-btn small"
                    aria-label="Delete document"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(d.id, d.title);
                    }}
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
