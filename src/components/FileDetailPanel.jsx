import { useState, useEffect, useRef } from 'react';

/**
 * FileDetailPanel — slide-in overlay panel showing detailed file analysis.
 */

const IMPORTANCE_STYLES = {
  high: { bg: 'rgba(255, 92, 92, 0.08)', border: 'rgba(255, 92, 92, 0.2)', color: '#ff5c5c', label: 'High' },
  medium: { bg: 'rgba(255, 193, 69, 0.08)', border: 'rgba(255, 193, 69, 0.2)', color: '#ffc145', label: 'Medium' },
  low: { bg: 'rgba(79, 91, 115, 0.08)', border: 'rgba(79, 91, 115, 0.2)', color: '#4f5b73', label: 'Low' },
};

export default function FileDetailPanel({ file, isOpen, onClose, onNavigateTo }) {
  const [copiedLine, setCopiedLine] = useState(null);
  const [expandedClasses, setExpandedClasses] = useState({});
  const panelRef = useRef(null);

  useEffect(() => {
    setCopiedLine(null);
    setExpandedClasses({});
  }, [file?.path]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleCopyLine = async (funcName, line) => {
    const text = `${file.path}:${line}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLine(funcName);
      setTimeout(() => setCopiedLine(null), 2000);
    } catch {
      setCopiedLine(null);
    }
  };

  const toggleClass = (className) => {
    setExpandedClasses((prev) => ({ ...prev, [className]: !prev[className] }));
  };

  const importance = IMPORTANCE_STYLES[file?.importance] || IMPORTANCE_STYLES.low;
  const fileName = file?.path?.split('/').pop() || '';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(6, 8, 12, 0.6)',
          backdropFilter: isOpen ? 'blur(4px)' : 'none',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full z-[70] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: '420px',
          backgroundColor: 'var(--color-bg-sidebar)',
          borderLeft: '1px solid var(--color-border-subtle)',
          boxShadow: isOpen ? '-16px 0 64px rgba(0, 0, 0, 0.5)' : 'none',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {file && (
          <>
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <FileIcon />
                <div className="min-w-0 flex-1">
                  <h2
                    className="text-sm font-semibold truncate"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                  >
                    {fileName}
                  </h2>
                  <p className="text-[10px] truncate" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {file.path}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="text-[9px] font-medium px-2 py-0.5 rounded-md uppercase tracking-wider"
                  style={{
                    backgroundColor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border-subtle)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {file.language}
                </span>
                <button
                  id="file-panel-close"
                  className="p-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                  }}
                  onClick={onClose}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Importance badge */}
            <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: importance.color }} />
                <span className="text-xs font-medium" style={{ color: importance.color, fontFamily: 'var(--font-display)' }}>
                  {importance.label} Importance
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              <Section title="Summary" icon={<SummaryIcon />}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)' }}>
                  {file.summary}
                </p>
              </Section>

              {file.functions?.length > 0 && (
                <Section title="Functions" icon={<FunctionIcon />} count={file.functions.length}>
                  <div className="space-y-1">
                    {file.functions.map((fn) => (
                      <button
                        key={fn.name}
                        className="w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-100 cursor-pointer group"
                        style={{ backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        onClick={() => handleCopyLine(fn.name, fn.line)}
                        title={`Click to copy ${file.path}:${fn.line}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold" style={{ color: '#00ffe0', fontFamily: 'var(--font-mono)' }}>
                              {fn.name}
                            </span>
                            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                              ({fn.args?.join(', ')})
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                              L{fn.line}
                            </span>
                            {copiedLine === fn.name ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            )}
                          </div>
                        </div>
                        {fn.docstring && (
                          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                            {fn.docstring}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {file.classes?.length > 0 && (
                <Section title="Classes" icon={<ClassIcon />} count={file.classes.length}>
                  <div className="space-y-1">
                    {file.classes.map((cls) => {
                      const isExpanded = expandedClasses[cls.name] ?? false;
                      return (
                        <div key={cls.name}>
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors duration-100 cursor-pointer"
                            style={{ backgroundColor: 'transparent' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            onClick={() => toggleClass(cls.name)}
                          >
                            <svg
                              width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2.5"
                              strokeLinecap="round" strokeLinejoin="round"
                              className="flex-shrink-0 transition-transform duration-150"
                              style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            <span className="text-xs font-semibold" style={{ color: '#6366f1', fontFamily: 'var(--font-mono)' }}>
                              {cls.name}
                            </span>
                            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                              {cls.methods?.length || 0} methods
                            </span>
                          </button>
                          {isExpanded && cls.methods?.length > 0 && (
                            <div className="ml-7 pl-3 space-y-0.5" style={{ borderLeft: '1px solid var(--color-border-subtle)' }}>
                              {cls.methods.map((method) => (
                                <div key={method} className="flex items-center gap-2 py-1.5 px-2 rounded text-[11px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                                  <span style={{ color: 'var(--color-text-muted)' }}>def</span>
                                  <span>{method}()</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {file.imports?.length > 0 && (
                <Section title="Imports" icon={<ImportIcon />} count={file.imports.length}>
                  <div className="flex flex-wrap gap-2">
                    {file.imports.map((imp) => (
                      <button
                        key={imp}
                        className="px-2.5 py-1 rounded-lg text-[11px] transition-all duration-150 cursor-pointer"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          backgroundColor: 'var(--color-bg-tertiary)',
                          color: 'var(--color-text-secondary)',
                          border: '1px solid var(--color-border-subtle)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(0,255,224,0.3)';
                          e.currentTarget.style.color = '#00ffe0';
                          e.currentTarget.style.backgroundColor = 'rgba(0,255,224,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                          e.currentTarget.style.color = 'var(--color-text-secondary)';
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                        }}
                        onClick={() => onNavigateTo?.(imp)}
                        title={`Navigate to ${imp}`}
                      >
                        {imp}
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              <div className="h-6" />
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Section({ title, icon, count, children }) {
  return (
    <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>
          {title}
        </h3>
        {count != null && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ffe0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  );
}

function FunctionIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ClassIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function ImportIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}
