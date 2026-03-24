import { useState, useMemo, useRef } from 'react';

/**
 * FileTree — collapsible file tree sidebar with search, tooltips, and importance dots.
 */

const LANG_COLORS = {
  py: '#3b82f6', python: '#3b82f6',
  js: '#eab308', javascript: '#eab308',
  ts: '#2dd4bf', typescript: '#2dd4bf', tsx: '#2dd4bf', jsx: '#eab308',
  go: '#10b981', golang: '#10b981',
  rs: '#f97316', rust: '#f97316',
  rb: '#ef4444', ruby: '#ef4444',
  java: '#f97316',
  json: '#34d399', yaml: '#34d399', yml: '#34d399',
  md: '#8892a8', css: '#38bdf8', html: '#f97316',
  default: '#4f5b73',
};

const IMPORTANCE_COLORS = {
  high: '#ff5c5c',
  medium: '#ffc145',
  low: '#4f5b73',
};

function buildTree(files) {
  const root = { name: '', children: {}, files: [] };
  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts[i];
      if (!current.children[dir]) {
        current.children[dir] = { name: dir, children: {}, files: [] };
      }
      current = current.children[dir];
    }
    current.files.push({ ...file, name: parts[parts.length - 1] });
  }
  return root;
}

function getFileColor(file) {
  const lang = (file.language || '').toLowerCase();
  if (LANG_COLORS[lang]) return LANG_COLORS[lang];
  const ext = file.name?.split('.').pop()?.toLowerCase() || '';
  return LANG_COLORS[ext] || LANG_COLORS.default;
}

/* ===== Tooltip ===== */
function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: rect.right + 8, y: rect.top + rect.height / 2 });
    setShow(true);
  };

  return (
    <div ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={() => setShow(false)} className="relative">
      {children}
      {show && text && (
        <div
          className="fixed z-[100] px-3 py-2 rounded-lg text-xs max-w-xs pointer-events-none"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: 'translateY(-50%)',
            backgroundColor: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-default)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.15s ease-out',
            fontFamily: 'var(--font-display)',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

function FileIcon({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon({ open }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      {open ? (
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v2M2 10h20l-2 9H4L2 10z" stroke="#4f5b73" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="#4f5b73" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function Chevron({ open }) {
  return (
    <svg
      width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4f5b73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0 transition-transform duration-150"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function DirectoryNode({ name, node, depth, onFileSelect, activeFile, searchQuery }) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const dirs = Object.keys(node.children).sort();
  const files = [...node.files].sort((a, b) => a.name.localeCompare(b.name));

  if (searchQuery && dirs.length === 0 && files.length === 0) return null;

  return (
    <div>
      {name && (
        <button
          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors duration-100"
          style={{
            paddingLeft: `${depth * 12 + 8}px`,
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-display)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Chevron open={isOpen} />
          <FolderIcon open={isOpen} />
          <span className="truncate">{name}</span>
        </button>
      )}

      {(isOpen || !name) && (
        <div>
          {dirs.map((dir) => (
            <DirectoryNode
              key={dir}
              name={dir}
              node={node.children[dir]}
              depth={name ? depth + 1 : depth}
              onFileSelect={onFileSelect}
              activeFile={activeFile}
              searchQuery={searchQuery}
            />
          ))}
          {files.map((file) => (
            <FileNode
              key={file.path}
              file={file}
              depth={name ? depth + 1 : depth}
              onFileSelect={onFileSelect}
              isActive={activeFile === file.path}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FileNode({ file, depth, onFileSelect, isActive }) {
  const color = getFileColor(file);
  const importanceColor = IMPORTANCE_COLORS[file.importance] || IMPORTANCE_COLORS.low;

  return (
    <Tooltip text={file.summary}>
      <button
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs cursor-pointer transition-all duration-100"
        style={{
          paddingLeft: `${depth * 12 + 20}px`,
          backgroundColor: isActive ? 'rgba(72, 229, 194, 0.06)' : 'transparent',
          color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
          borderLeft: isActive ? '2px solid #48E5C2' : '2px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }
        }}
        onClick={() => onFileSelect?.(file)}
      >
        <FileIcon color={color} />
        <span className="truncate flex-1 text-left" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{file.name}</span>
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: importanceColor }} title={`${file.importance} importance`} />
      </button>
    </Tooltip>
  );
}

export default function FileTree({ files = [], onFileSelect, activeFile = null }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return files;
    const q = search.toLowerCase();
    return files.filter(
      (f) => f.path.toLowerCase().includes(q) || f.name?.toLowerCase().includes(q) || f.language?.toLowerCase().includes(q)
    );
  }, [files, search]);

  const tree = useMemo(() => buildTree(filtered), [filtered]);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--color-bg-sidebar)' }}>
      {/* Search */}
      <div className="p-3" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="file-tree-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files…"
            className="flex-1 bg-transparent outline-none text-xs"
            style={{
              color: 'var(--color-text-primary)',
              caretColor: '#48E5C2',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
            }}
            autoComplete="off"
            spellCheck="false"
          />
          {search && (
            <button className="cursor-pointer" onClick={() => setSearch('')} style={{ color: 'var(--color-text-muted)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        {search && (
          <p className="text-[10px] mt-1.5 px-1" style={{ color: 'var(--color-text-muted)' }}>
            {filtered.length} file{filtered.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-2 px-1" style={{ scrollbarWidth: 'thin' }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-border-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-xs mt-3 text-center" style={{ color: 'var(--color-text-muted)' }}>
              No files match<br />"{search}"
            </p>
          </div>
        ) : (
          <DirectoryNode name="" node={tree} depth={0} onFileSelect={onFileSelect} activeFile={activeFile} searchQuery={search} />
        )}
      </div>

      {/* Footer */}
      <div
        className="px-3 py-2 text-[10px]"
        style={{
          borderTop: '1px solid var(--color-border-subtle)',
          color: 'var(--color-text-muted)',
        }}
      >
        {files.length} files in repository
      </div>
    </div>
  );
}
