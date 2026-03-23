import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * ChatInterface — codebase Q&A chat with message bubbles, citations, and starter chips.
 */

const STARTER_QUESTIONS = [
  'What does this repo do?',
  'Where should I start reading?',
  'What are the main entry points?',
  'How is authentication handled?',
];

export default function ChatInterface({ messages = [], onSendMessage, onNavigateTo, isLoading = false }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const isEmpty = messages.length === 0;
  const canSend = input.trim().length > 0 && !isLoading;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const maxHeight = 4 * 24;
    ta.style.height = `${Math.min(ta.scrollHeight, maxHeight)}px`;
  }, [input]);

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSendMessage?.(input.trim());
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [canSend, input, onSendMessage]);

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (question) => {
    onSendMessage?.(question);
  };

  return (
    <div className="flex flex-col h-full min-w-0 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      {/* Messages area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: 'thin' }}>
        {isEmpty && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,224,0.08), rgba(99,102,241,0.08))',
                border: '1px solid rgba(0,255,224,0.1)',
              }}
            >
              <BrainIcon />
            </div>
            <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
              Ask about this codebase
            </h3>
            <p className="text-xs text-center max-w-[260px] mb-6" style={{ color: 'var(--color-text-muted)' }}>
              I can explain architecture, trace data flows, find bugs, and more.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} onNavigateTo={onNavigateTo} />
            ))}
            {isLoading && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Starter chips */}
      {isEmpty && !isLoading && (
        <div className="px-5 pb-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                className="px-3.5 py-2 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-display)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-subtle)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,255,224,0.25)';
                  e.currentTarget.style.color = '#00ffe0';
                  e.currentTarget.style.backgroundColor = 'rgba(0,255,224,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onClick={() => handleChipClick(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar — frosted glass container */}
      <div className="flex-shrink-0 px-4 py-3">
        <div
          className="rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Textarea area */}
          <div className="px-4 pt-4 pb-2">
            <textarea
              ref={textareaRef}
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about this codebase..."
              rows={1}
              className="w-full bg-transparent outline-none text-sm resize-none border-none"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'rgba(255, 255, 255, 0.9)',
                caretColor: '#00ffe0',
                lineHeight: '24px',
                minHeight: '60px',
                maxHeight: `${5 * 24}px`,
                scrollbarWidth: 'thin',
              }}
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          {/* Bottom toolbar — separated */}
          <div
            className="px-4 py-3 flex items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            {/* Left action buttons */}
            <div className="flex items-center gap-1">
              {/* Attach button */}
              <button
                type="button"
                className="p-2 rounded-lg transition-all duration-150 cursor-pointer relative group"
                style={{ color: 'rgba(255, 255, 255, 0.35)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Attach file"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              {/* Command button */}
              <button
                type="button"
                className="p-2 rounded-lg transition-all duration-150 cursor-pointer relative group"
                style={{ color: 'rgba(255, 255, 255, 0.35)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Commands"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
              </button>
            </div>

            {/* Send button — labeled, with active state */}
            <button
              id="chat-send"
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: 'var(--font-display)',
                backgroundColor: canSend ? '#00ffe0' : 'rgba(255, 255, 255, 0.05)',
                color: canSend ? '#06080c' : 'rgba(255, 255, 255, 0.35)',
                boxShadow: canSend ? '0 4px 16px rgba(0, 255, 224, 0.15)' : 'none',
              }}
              disabled={!canSend}
              onClick={handleSend}
              onMouseEnter={(e) => {
                if (canSend) {
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 255, 224, 0.25)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (canSend) {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 255, 224, 0.15)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              title="Send (Ctrl+Enter)"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Message Bubble ===== */
function MessageBubble({ message, onNavigateTo }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2.5`}>
      {!isUser && (
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,224,0.1), rgba(99,102,241,0.1))',
            border: '1px solid rgba(0,255,224,0.1)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00ffe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      )}

      <div className="max-w-[80%]">
        <div
          className="px-3.5 py-2.5 rounded-xl text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, rgba(0,255,224,0.12), rgba(99,102,241,0.12))',
                  color: 'var(--color-text-primary)',
                  border: '1px solid rgba(0,255,224,0.15)',
                  borderBottomRightRadius: '4px',
                  fontFamily: 'var(--font-display)',
                }
              : {
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-subtle)',
                  borderBottomLeftRadius: '4px',
                  fontFamily: 'var(--font-display)',
                }
          }
        >
          {message.text.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {renderLine(line)}
            </span>
          ))}
        </div>

        {!isUser && message.citations?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
            {message.citations.map((cite, i) => (
              <button
                key={i}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] transition-all duration-100 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'rgba(0, 255, 224, 0.04)',
                  color: '#00ffe0',
                  border: '1px solid rgba(0, 255, 224, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 255, 224, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 224, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 255, 224, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 224, 0.1)';
                }}
                onClick={() => onNavigateTo?.(cite.file, cite.line)}
                title={`${cite.file}:${cite.line}`}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                {cite.file.split('/').pop()}:{cite.line}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderLine(line) {
  const parts = line.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1 py-0.5 rounded text-[12px]" style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'rgba(0,255,224,0.06)', color: '#00ffe0' }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bp, j) => {
      if (bp.startsWith('**') && bp.endsWith('**')) {
        return <strong key={`${i}-${j}`} style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{bp.slice(2, -2)}</strong>;
      }
      return <span key={`${i}-${j}`}>{bp}</span>;
    });
  });
}

function ThinkingIndicator() {
  return (
    <div className="flex justify-start gap-2.5">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: 'linear-gradient(135deg, rgba(0,255,224,0.1), rgba(99,102,241,0.1))',
          border: '1px solid rgba(0,255,224,0.1)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00ffe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div
        className="px-4 py-3 rounded-xl flex items-center gap-1.5"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-subtle)',
          borderBottomLeftRadius: '4px',
        }}
      >
        <PulseDot delay={0} />
        <PulseDot delay={150} />
        <PulseDot delay={300} />
      </div>
    </div>
  );
}

function PulseDot({ delay }) {
  return (
    <div
      className="w-2 h-2 rounded-full"
      style={{
        backgroundColor: '#00ffe0',
        animation: `chatPulse 1.4s ease-in-out infinite`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

function BrainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ffe0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
