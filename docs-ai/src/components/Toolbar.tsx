import type { Editor } from '@tiptap/react';
import { Icon, type IconName } from './Icon';

interface ToolbarProps {
  editor: Editor | null;
  aiOpen: boolean;
  onToggleAI: () => void;
}

function Btn({
  icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`tb-btn${active ? ' active' : ''}`}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep the editor selection
      onClick={onClick}
    >
      <Icon name={icon} />
    </button>
  );
}

const Divider = () => <span className="tb-divider" />;

type BlockStyle = 'p' | 'h1' | 'h2' | 'h3';

export function Toolbar({ editor, aiOpen, onToggleAI }: ToolbarProps) {
  const e = editor;
  const chain = () => e!.chain().focus();

  const blockStyle: BlockStyle = !e
    ? 'p'
    : e.isActive('heading', { level: 1 })
      ? 'h1'
      : e.isActive('heading', { level: 2 })
        ? 'h2'
        : e.isActive('heading', { level: 3 })
          ? 'h3'
          : 'p';

  const setBlockStyle = (v: BlockStyle) => {
    if (!e) return;
    if (v === 'p') chain().setParagraph().run();
    else chain().setHeading({ level: Number(v[1]) as 1 | 2 | 3 }).run();
  };

  const setLink = () => {
    if (!e) return;
    const prev = e.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') chain().extendMarkRange('link').unsetLink().run();
    else chain().extendMarkRange('link').setLink({ href: url }).run();
  };

  const color = (e?.getAttributes('textStyle').color as string | undefined) ?? '#202124';

  return (
    <div className="toolbar" role="toolbar" aria-label="Formatting">
      <div className="tb-group">
        <Btn icon="undo" label="Undo (Ctrl+Z)" disabled={!e?.can().undo()} onClick={() => chain().undo().run()} />
        <Btn icon="redo" label="Redo (Ctrl+Y)" disabled={!e?.can().redo()} onClick={() => chain().redo().run()} />
        <Divider />
        <select
          className="tb-select"
          aria-label="Styles"
          value={blockStyle}
          onChange={(ev) => setBlockStyle(ev.target.value as BlockStyle)}
        >
          <option value="p">Normal text</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <Divider />
        <Btn icon="bold" label="Bold (Ctrl+B)" active={e?.isActive('bold')} onClick={() => chain().toggleBold().run()} />
        <Btn icon="italic" label="Italic (Ctrl+I)" active={e?.isActive('italic')} onClick={() => chain().toggleItalic().run()} />
        <Btn
          icon="underline"
          label="Underline (Ctrl+U)"
          active={e?.isActive('underline')}
          onClick={() => chain().toggleUnderline().run()}
        />
        <Btn icon="strike" label="Strikethrough" active={e?.isActive('strike')} onClick={() => chain().toggleStrike().run()} />
        <label className="tb-btn tb-color" title="Text color">
          <span className="tb-color-a">A</span>
          <span className="tb-color-bar" style={{ background: color }} />
          <input
            type="color"
            aria-label="Text color"
            value={color}
            onChange={(ev) => chain().setColor(ev.target.value).run()}
          />
        </label>
        <Btn
          icon="highlight"
          label="Highlight"
          active={e?.isActive('highlight')}
          onClick={() => chain().toggleHighlight({ color: '#fef08a' }).run()}
        />
        <Divider />
        <Btn icon="link" label="Insert link (Ctrl+K)" active={e?.isActive('link')} onClick={setLink} />
        <Divider />
        <Btn icon="alignLeft" label="Left align" active={e?.isActive({ textAlign: 'left' })} onClick={() => chain().setTextAlign('left').run()} />
        <Btn icon="alignCenter" label="Center align" active={e?.isActive({ textAlign: 'center' })} onClick={() => chain().setTextAlign('center').run()} />
        <Btn icon="alignRight" label="Right align" active={e?.isActive({ textAlign: 'right' })} onClick={() => chain().setTextAlign('right').run()} />
        <Btn icon="alignJustify" label="Justify" active={e?.isActive({ textAlign: 'justify' })} onClick={() => chain().setTextAlign('justify').run()} />
        <Divider />
        <Btn icon="bulletList" label="Bulleted list" active={e?.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()} />
        <Btn icon="numberList" label="Numbered list" active={e?.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()} />
        <Btn icon="quote" label="Quote" active={e?.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()} />
        <Btn icon="code" label="Code block" active={e?.isActive('codeBlock')} onClick={() => chain().toggleCodeBlock().run()} />
        <Divider />
        <Btn icon="clearFormat" label="Clear formatting" onClick={() => chain().unsetAllMarks().clearNodes().run()} />
      </div>

      <button
        type="button"
        className={`ask-ai-btn${aiOpen ? ' open' : ''}`}
        onClick={onToggleAI}
        aria-pressed={aiOpen}
        title="Ask AI about this document"
      >
        <Icon name="sparkle" size={18} />
        Ask AI
      </button>
    </div>
  );
}
