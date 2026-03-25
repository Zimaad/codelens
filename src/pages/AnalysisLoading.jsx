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
    <div className="noise-overlay min-h-screen flex flex-col relative overflow-hidden bg-[var(--color-bg-primary)]">
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/5">
        <div
          className="h-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(72,229,194,0.4)] bg-gradient-to-r from-[#48E5C2] to-[#3178c6]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_600px_400px_at_50%_30%,rgba(72,229,194,0.04),transparent),radial-gradient(ellipse_400px_300px_at_70%_70%,rgba(99,102,241,0.03),transparent)]" />

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div
          className="relative z-10 w-full max-w-lg transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          {/* Spinning orb */}
          <div className="flex justify-center mb-12">
            <div className="relative w-24 h-24">
              {/* Outer glow ring */}
              <div
                className={`absolute inset-0 rounded-full blur-[1px] transition-opacity duration-1000 ${isComplete ? 'opacity-0' : 'opacity-30 animate-spin-slow'}`}
                style={{
                  background: `conic-gradient(from 0deg, #48E5C2, #3178c6, #34d399, #48E5C2)`
                }}
              />
              {/* Inner circle */}
              <div
                className={`absolute inset-[4px] rounded-full flex items-center justify-center bg-[var(--color-bg-primary)] transition-all duration-500 border-2 ${isComplete ? 'border-brand-cyan/40 scale-110' : 'border-brand-cyan/10'}`}
              >
                {isComplete ? (
                  <svg className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 scale-110" viewBox="0 0 24 24" fill="none" stroke="#48E5C2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="#48E5C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                    <line x1="14" y1="4" x2="10" y2="20" />
                  </svg>
                )}
              </div>
              {/* Ambient glow */}
              <div
                className={`absolute inset-0 -z-10 rounded-full blur-3xl scale-[2.5] bg-brand-cyan/10 transition-opacity duration-1000 ${isComplete ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-white font-display">
              {isComplete ? 'Analysis Finished' : 'Deconstructing Code'}
            </h2>
            <p className="text-[10px] md:text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] truncate px-6">
              {repoUrl ? repoUrl.replace(/^https?:\/\//, '') : 'github.com/example/repo'}
            </p>
          </div>

          {/* Steps list */}
          <div className="bg-[#0C0F16]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            {steps.map((label, index) => {
              const isDone = index < currentStep;
              const isActive = index === currentStep && !isComplete;
              const isPending = index > currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-5 px-8 py-5 transition-all duration-500 ${isActive ? 'bg-brand-cyan/[0.03]' : 'bg-transparent'} ${index < steps.length - 1 ? 'border-b border-white/[0.03]' : ''}`}
                  style={{
                    opacity: isPending ? 0.2 : 1,
                    animation: mounted ? `fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 150}ms both` : 'none',
                  }}
                >
                  {/* Step icon */}
                  <div
                    className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl transition-all duration-500 ${isDone ? 'bg-brand-cyan/10' : isActive ? 'bg-brand-cyan/20' : 'bg-white/5'}`}
                  >
                    {isDone ? (
                      <svg className="w-5 h-5 text-brand-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isActive ? (
                      <div className="relative w-5 h-5">
                        <svg className="w-5 h-5 animate-spin-slow" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="50 100" />
                        </svg>
                      </div>
                    ) : (
                      <div className="opacity-60 grayscale brightness-75 scale-90">
                        {STEP_ICONS[index] || <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />}
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <span className={`text-sm md:text-base font-bold tracking-tight transition-colors duration-500 font-display ${isDone ? 'text-brand-cyan' : isActive ? 'text-white' : 'text-zinc-500'}`}>
                      {label}
                    </span>
                    {isActive && (
                      <p className="text-[10px] text-brand-cyan/60 font-mono mt-0.5 animate-pulse uppercase tracking-wider">Processing assets...</p>
                    )}
                  </div>

                  {/* Active indicator dots */}
                  {isActive && (
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1 h-1 rounded-full bg-brand-cyan"
                          style={{
                            animation: `chatPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Done status */}
                  {isDone && (
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-cyan/40">Ready</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between mt-8 px-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 mb-1">Status</span>
              <span className="text-xs font-bold text-zinc-400">
                {isComplete ? 'Complete' : `Step ${Math.min(currentStep + 1, totalSteps)} of ${totalSteps}`}
              </span>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 mb-1">Progress</span>
              <span className="text-xl font-bold font-mono text-brand-cyan tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
