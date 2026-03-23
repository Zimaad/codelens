import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GITHUB_PATTERN = /^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+\/?$/;

const EXAMPLE_REPOS = [
  { slug: 'facebook/react', label: 'facebook / react', desc: 'UI library' },
  { slug: 'tiangolo/fastapi', label: 'tiangolo / fastapi', desc: 'Python API' },
  { slug: 'kelseyhightower/nocode', label: 'kelseyhightower / nocode', desc: 'No code' },
];

export default function RepoInput() {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const validate = (url) => {
    if (!url.trim()) return 'Please enter a GitHub repository URL';
    if (!GITHUB_PATTERN.test(url.trim())) return 'URL must match github.com/owner/repo';
    return '';
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setRepoUrl(val);
    if (submitted && val.trim()) {
      setError(validate(val));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const err = validate(repoUrl);
    if (err) {
      setError(err);
      inputRef.current?.focus();
      return;
    }
    setError('');
    const repoId = repoUrl
      .replace(/https?:\/\/(www\.)?github\.com\//, '')
      .replace(/\.git$/, '')
      .replace(/\/$/, '')
      .replace(/\//g, '-');
    navigate('/loading', { state: { repoUrl: repoUrl.trim(), repoId } });
  };

  const handleExampleClick = (slug) => {
    const url = `https://github.com/${slug}`;
    setRepoUrl(url);
    setError('');
    setSubmitted(false);
    inputRef.current?.focus();
  };

  return (
    <div
      className="noise-overlay min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Background decoration — asymmetric gradient mesh */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 700px 500px at 30% 20%, rgba(0, 255, 224, 0.04), transparent),
            radial-gradient(ellipse 500px 400px at 70% 80%, rgba(99, 102, 241, 0.05), transparent),
            radial-gradient(ellipse 300px 300px at 80% 20%, rgba(167, 139, 250, 0.03), transparent)
          `,
        }}
      />

      {/* Horizontal scan line decorative element */}
      <div
        className="fixed left-0 right-0 pointer-events-none"
        style={{
          top: '30%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,224,0.06) 30%, rgba(0,255,224,0.12) 50%, rgba(0,255,224,0.06) 70%, transparent 100%)',
        }}
      />
      <div
        className="fixed left-0 right-0 pointer-events-none"
        style={{
          top: '70%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.06) 20%, rgba(99,102,241,0.1) 50%, rgba(99,102,241,0.06) 80%, transparent 100%)',
        }}
      />

      {/* Main content */}
      <div
        className="relative z-10 w-full"
        style={{
          maxWidth: '580px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className="flex items-center justify-center"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(0,255,224,0.15), rgba(99,102,241,0.15))',
                border: '1px solid rgba(0,255,224,0.2)',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ffe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
                <line x1="14" y1="4" x2="10" y2="20" />
              </svg>
            </div>
            {/* Glow behind logo */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                borderRadius: '16px',
                background: 'radial-gradient(circle, rgba(0,255,224,0.15) 0%, transparent 70%)',
                filter: 'blur(20px)',
                transform: 'scale(2)',
              }}
            />
          </div>
        </div>

        {/* Heading — large, dramatic, ClashDisplay */}
        <h1
          className="text-center font-bold mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: 1.1,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
          }}
        >
          Understand any
          <br />
          codebase <span className="text-gradient">instantly</span>
        </h1>

        {/* Subheading */}
        <p
          className="text-center mb-10 mx-auto"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.95rem',
            maxWidth: '380px',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Paste a GitHub URL → get an interactive map, dependency graph, and AI-powered chat
        </p>

        {/* Card container */}
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: 'rgba(12, 15, 22, 0.6)',
            border: '1px solid var(--color-border-subtle)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 16px 64px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Input wrapper with animated border */}
            <div
              className="relative rounded-xl mb-1.5"
              style={{
                padding: '1.5px',
                background: isFocused
                  ? 'linear-gradient(135deg, #00ffe0, #6366f1, #a78bfa, #00ffe0)'
                  : error
                  ? 'var(--color-error)'
                  : 'var(--color-border-default)',
                backgroundSize: isFocused ? '300% 300%' : '100% 100%',
                animation: isFocused ? 'gradient-rotate 4s ease infinite' : 'none',
                transition: 'background 0.3s ease',
              }}
            >
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3.5"
                style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
              >
                {/* GitHub icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0 transition-colors duration-300"
                  stroke={isFocused ? '#00ffe0' : error ? 'var(--color-error)' : 'var(--color-text-muted)'}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <input
                  ref={inputRef}
                  id="repo-url-input"
                  type="text"
                  value={repoUrl}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="https://github.com/owner/repo"
                  className="flex-1 bg-transparent outline-none text-sm font-mono"
                  style={{
                    color: 'var(--color-text-primary)',
                    caretColor: '#00ffe0',
                    fontFamily: 'var(--font-mono)',
                  }}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Inline error */}
            <div className="h-6 flex items-center px-1">
              {error && (
                <p className="text-xs flex items-center gap-1.5 animate-fade-in" style={{ color: 'var(--color-error)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            {/* CTA Button */}
            <button
              id="analyze-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold text-black transition-all duration-300 cursor-pointer mt-1"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, #00ffe0, #00d4bb)',
                boxShadow: '0 4px 24px rgba(0, 255, 224, 0.2)',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 255, 224, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 255, 224, 0.2)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Analyze Repository
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--color-border-subtle), transparent)' }} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--color-text-muted)' }}>
              try an example
            </span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--color-border-subtle), transparent)' }} />
          </div>

          {/* Example repo cards */}
          <div className="grid gap-2.5">
            {EXAMPLE_REPOS.map((repo, i) => (
              <button
                key={repo.slug}
                id={`example-${repo.slug.replace('/', '-')}`}
                type="button"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer group"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border-subtle)',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,255,224,0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(0,255,224,0.03)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-primary)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                onClick={() => handleExampleClick(repo.slug)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 transition-colors group-hover:stroke-[#00ffe0]">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                    {repo.label}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  {repo.desc}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p
        className="relative z-10 text-center text-[11px] mt-10"
        style={{
          color: 'var(--color-text-muted)',
          letterSpacing: '0.05em',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease 0.5s',
        }}
      >
        Supports public GitHub repositories · Analysis powered by AI
      </p>
    </div>
  );
}
