import { useParams, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { repoId } = useParams();
  const navigate = useNavigate();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: OverviewIcon, active: true },
    { id: 'architecture', label: 'Architecture', icon: ArchIcon },
    { id: 'files', label: 'File Explorer', icon: FilesIcon },
    { id: 'dependencies', label: 'Dependencies', icon: DepsIcon },
    { id: 'insights', label: 'AI Insights', icon: InsightsIcon },
  ];

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col animate-slide-left"
      style={{
        width: '260px',
        backgroundColor: 'var(--color-bg-sidebar)',
        borderRight: '1px solid var(--color-border-subtle)',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 cursor-pointer group"
        style={{ height: '64px', borderBottom: '1px solid var(--color-border-subtle)' }}
        onClick={() => navigate('/')}
      >
        <div
          className="flex items-center justify-center rounded-lg transition-all duration-200"
          style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, rgba(0,255,224,0.15), rgba(99,102,241,0.15))',
            border: '1px solid rgba(0,255,224,0.15)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ffe0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
            <line x1="14" y1="4" x2="10" y2="20" />
          </svg>
        </div>
        <span
          className="text-base font-semibold tracking-tight"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          CodeLens
        </span>
        <span
          className="ml-auto text-[9px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded"
          style={{
            color: '#00ffe0',
            backgroundColor: 'rgba(0,255,224,0.06)',
            border: '1px solid rgba(0,255,224,0.1)',
          }}
        >
          beta
        </span>
      </div>

      {/* Repo badge */}
      {repoId && (
        <div className="px-4 py-3">
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs"
            style={{
              fontFamily: 'var(--font-mono)',
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="truncate">{repoId?.replace(/-/g, '/')}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item, index) => {
          const isActive = item.active;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: 'var(--font-display)',
                color: isActive ? '#00ffe0' : 'var(--color-text-secondary)',
                backgroundColor: isActive ? 'rgba(0,255,224,0.05)' : 'transparent',
                borderLeft: isActive ? '2px solid #00ffe0' : '2px solid transparent',
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
            >
              <item.icon active={isActive} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid var(--color-border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
            style={{
              background: 'linear-gradient(135deg, #00ffe0, #6366f1)',
              color: '#06080c',
              fontFamily: 'var(--font-display)',
            }}
          >
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
              User
            </p>
            <p className="text-[10px] truncate" style={{ color: 'var(--color-text-muted)' }}>
              Free plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ===== Icon Components ===== */
function OverviewIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ArchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
      <path d="m4.93 4.93 2.83 2.83m8.48 8.48 2.83 2.83m-2.83-14.14 2.83-2.83M4.93 19.07l2.83-2.83" />
    </svg>
  );
}

function FilesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function DepsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM3 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM3 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
      <path d="M7 6h10M7 18h10M12 6v12" />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  );
}
