/**
 * AnalysisLoading — props-driven multi-step progress page.
 *
 * Props:
 *   steps        – string[] of step labels
 *   currentStep  – index of the step currently in progress (0-based)
 *   repoUrl      – the repo URL being analyzed (display only)
 *   onComplete   – callback fired when all steps are done
 */
import { useEffect, useState } from 'react';

const STEP_ICONS = [
  // Clone
  <svg key="clone" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  // Tree
  <svg key="tree" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  // AST
  <svg key="ast" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  // Embeddings
  <svg key="embed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  // Graph
  <svg key="graph" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  // Summary
  <svg key="summary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
];

export default function AnalysisLoading({
  steps = [],
  currentStep = 0,
  repoUrl = '',
  onComplete,
}) {
  const [mounted, setMounted] = useState(false);
  const totalSteps = steps.length;
  const isComplete = currentStep >= totalSteps;
  const progress = totalSteps > 0
    ? Math.min(((currentStep) / totalSteps) * 100, 100)
    : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fire onComplete when all steps done
  if (isComplete && onComplete) {
    setTimeout(onComplete, 800);
  }

  return (
    <div
      className="noise-overlay min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Top progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.03)' }}
      >
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00ffe0, #6366f1)',
            boxShadow: '0 0 20px rgba(0, 255, 224, 0.4)',
          }}
        />
      </div>

      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 600px 400px at 50% 30%, rgba(0, 255, 224, 0.04), transparent),
            radial-gradient(ellipse 400px 300px at 70% 70%, rgba(99, 102, 241, 0.03), transparent)
          `,
        }}
      />

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div
          className="relative z-10 w-full max-w-lg"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Spinning orb */}
          <div className="flex justify-center mb-10">
            <div className="relative" style={{ width: '80px', height: '80px' }}>
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, #00ffe0, #6366f1, #a78bfa, #00ffe0)`,
                  opacity: isComplete ? 0 : 0.25,
                  animation: isComplete ? 'none' : 'spin-slow 2.5s linear infinite',
                  transition: 'opacity 0.5s ease',
                  filter: 'blur(1px)',
                }}
              />
              {/* Inner circle */}
              <div
                className="absolute inset-[3px] rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--color-bg-primary)',
                  border: isComplete ? '2px solid rgba(0,229,160,0.3)' : '2px solid rgba(0,255,224,0.1)',
                  transition: 'border-color 0.5s ease',
                }}
              >
                {isComplete ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00ffe0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                    <line x1="14" y1="4" x2="10" y2="20" />
                  </svg>
                )}
              </div>
              {/* Ambient glow */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(0,255,224,0.1) 0%, transparent 70%)',
                  filter: 'blur(24px)',
                  transform: 'scale(2.5)',
                  opacity: isComplete ? 0 : 1,
                  transition: 'opacity 0.5s ease',
                }}
              />
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-center font-semibold mb-1"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {isComplete ? 'Analysis Complete' : 'Analyzing Repository'}
          </h2>
          <p
            className="text-center text-xs font-mono mb-8 truncate px-4"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            {repoUrl || 'github.com/example/repo'}
          </p>

          {/* Steps list */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(12, 15, 22, 0.5)',
              border: '1px solid var(--color-border-subtle)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {steps.map((label, index) => {
              const isDone = index < currentStep;
              const isActive = index === currentStep && !isComplete;
              const isPending = index > currentStep;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3.5 px-5 py-3.5 transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? 'rgba(0, 255, 224, 0.04)' : 'transparent',
                    borderBottom: index < steps.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                    opacity: isPending ? 0.3 : 1,
                    animation: mounted ? `fadeIn 0.5s ease-out ${index * 120}ms both` : 'none',
                  }}
                >
                  {/* Step icon */}
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: isDone
                        ? 'rgba(0, 229, 160, 0.1)'
                        : isActive
                        ? 'rgba(0, 255, 224, 0.1)'
                        : 'rgba(79, 91, 115, 0.1)',
                      color: isDone
                        ? '#00e5a0'
                        : isActive
                        ? '#00ffe0'
                        : 'var(--color-text-muted)',
                    }}
                  >
                    {isDone ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isActive ? (
                      <div className="relative flex items-center justify-center" style={{ width: '16px', height: '16px' }}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" style={{ animation: 'spin-slow 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(0,255,224,0.15)" strokeWidth="2.5" />
                          <circle cx="12" cy="12" r="10" fill="none" stroke="#00ffe0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="50 100" />
                        </svg>
                      </div>
                    ) : (
                      STEP_ICONS[index] || <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-text-muted)', opacity: 0.3 }} />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className="text-sm font-medium flex-1"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: isDone
                        ? '#00e5a0'
                        : isActive
                        ? 'var(--color-text-primary)'
                        : 'var(--color-text-muted)',
                    }}
                  >
                    {label}
                  </span>

                  {/* Active indicator dots */}
                  {isActive && (
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="rounded-full"
                          style={{
                            width: '3px',
                            height: '3px',
                            backgroundColor: '#00ffe0',
                            animation: `chatPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Done checkmark */}
                  {isDone && (
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(0,229,160,0.5)' }}>done</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between mt-5 px-1">
            <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              {isComplete ? 'Redirecting…' : `Step ${Math.min(currentStep + 1, totalSteps)} of ${totalSteps}`}
            </span>
            <span
              className="text-sm font-semibold font-mono"
              style={{
                fontFamily: 'var(--font-mono)',
                color: isComplete ? '#00e5a0' : '#00ffe0',
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
