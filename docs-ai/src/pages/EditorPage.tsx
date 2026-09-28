import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { marked } from 'marked';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AskAIPanel } from '../components/AskAIPanel';
import { Avatar } from '../components/Avatar';
import { DocsLogo, Icon } from '../components/Icon';
import { Toolbar } from '../components/Toolbar';
import { getDoc, updateDoc } from '../lib/docs';

type SaveState = 'saved' | 'saving' | 'error';
const SAVE_DELAY_MS = 800;

export function EditorPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [aiOpen, setAiOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const pending = useRef<{ title?: string; content?: JSONContent }>({});
  const timer = useRef<number | undefined>(undefined);

  const flush = useCallback(async () => {
    window.clearTimeout(timer.current);
    const patch = pending.current;
    pending.current = {};
    if (!Object.keys(patch).length) return;
    setSaveState('saving');
    try {
      await updateDoc(id, patch);
      setSaveState('saved');
    } catch {
      pending.current = { ...patch, ...pending.current };
      setSaveState('error');
    }
  }, [id]);

  const queueSave = useCallback(
    (patch: { title?: string; content?: JSONContent }) => {
      pending.current = { ...pending.current, ...patch };
      setSaveState('saving');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, SAVE_DELAY_MS);
    },
    [flush],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Type here, or click “Ask AI” to chat about this document…' }),
    ],
    shouldRerenderOnTransaction: true, // keeps toolbar active states in sync
    editorProps: { attributes: { class: 'doc-content', spellcheck: 'true' } },
    onUpdate: ({ editor }) => queueSave({ content: editor.getJSON() }),
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      setSelectedText(from === to ? '' : editor.state.doc.textBetween(from, to, '\n').trim());
    },
  });

  useEffect(() => {
    if (!editor) return;
    let cancelled = false;
    getDoc(id)
      .then((doc) => {
        if (cancelled) return;
        setTitle(doc.title);
        document.title = `${doc.title || 'Untitled document'} - Docs`;
        editor.commands.setContent(doc.content?.type ? doc.content : '', { emitUpdate: false });
        setLoaded(true);
      })
      .catch(() => navigate('/', { replace: true }));
    return () => {
      cancelled = true;
    };
  }, [id, editor, navigate]);

  // Save on tab close / navigation away.
  useEffect(() => {
    const onHide = () => void flush();
    window.addEventListener('beforeunload', onHide);
    return () => {
      window.removeEventListener('beforeunload', onHide);
      void flush();
    };
  }, [flush]);

  // Ctrl/Cmd+Alt+A toggles the AI panel (a nod to Docs' shortcuts).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAiOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onTitle = (value: string) => {
    setTitle(value);
    document.title = `${value || 'Untitled document'} - Docs`;
    queueSave({ title: value });
  };

  const getDocumentText = useCallback(() => editor?.getText({ blockSeparator: '\n\n' }) ?? '', [editor]);

  const insertFromAI = useCallback(
    (markdown: string) => {
      if (!editor) return;
      const html = marked.parse(markdown, { async: false }) as string;
      editor.chain().focus().insertContent(html).run();
    },
    [editor],
  );

  return (
    <div className="editor-shell">
      <header className="doc-header">
        <Link to="/" className="doc-home" title="Docs home" onClick={() => void flush()}>
          <DocsLogo size={40} />
        </Link>
        <div className="doc-header-main">
          <input
            className="title-input"
            value={title}
            placeholder="Untitled document"
            aria-label="Rename"
            onChange={(e) => onTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && editor?.commands.focus('start')}
          />
          <span className={`save-state ${saveState}`}>
            {saveState === 'saving' && 'Saving…'}
            {saveState === 'saved' && (
              <>
                <Icon name="cloudDone" size={16} /> Saved to InsForge
              </>
            )}
            {saveState === 'error' && (
              <button className="text-btn" onClick={() => void flush()}>
                Couldn’t save — retry
              </button>
            )}
          </span>
        </div>
        <Avatar />
      </header>

      <Toolbar editor={editor} aiOpen={aiOpen} onToggleAI={() => setAiOpen((o) => !o)} />

      <div className="workspace">
        <div className="canvas">
          <div className={`page${loaded ? '' : ' loading'}`}>
            <EditorContent editor={editor} />
          </div>
        </div>
        {aiOpen && (
          <AskAIPanel
            documentId={id}
            title={title}
            getDocumentText={getDocumentText}
            selectedText={selectedText}
            onInsert={insertFromAI}
            onClose={() => setAiOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
