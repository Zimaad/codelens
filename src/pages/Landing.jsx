import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobePulse } from '../components/ui/cobe-globe-pulse';

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      title: "Dependency Mapping",
      description: "Visualize complex relationships between modules with our interactive graph engine.",
      icon: (
        <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "AI Analysis",
      description: "Deep-dive into logic flows and architecture patterns using our proprietary LLM integration.",
      icon: (
        <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Intelligence at Scale",
      description: "Deconstruct millions of lines of code in seconds, not hours. Built for the modern engineer.",
      icon: (
        <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center relative font-sans bg-[#0B1215] text-white noise-overlay">
      {/* Rotating globe background (replaces the old grid/radial background) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <GlobePulse className="w-[170vmax] max-w-none opacity-90" />
        </div>
      </div>

      {/* Header */}
      <header className="flex items-center px-6 md:px-12 py-12 md:py-16 w-full relative z-20">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center gap-3 md:gap-5">
          <div className="flex items-center gap-4">
            <svg className="w-6 h-6 md:w-9 md:h-9 text-brand-cyan" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2a10 10 0 0 1 8 4" />
              <path d="M12 18a6 6 0 0 0 6-6c0-1.65-.67-3.15-1.76-4.24" />
              <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
            <span className="text-xl md:text-2xl font-black tracking-tighter font-display uppercase italic">CodeLens</span>
          </div>
        </div>

        <nav className="hidden md:flex gap-10 text-xs md:text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
          <a className="hover:text-brand-cyan transition-colors" href="#">Manifesto</a>
          <a className="hover:text-brand-cyan transition-colors" href="#">Intelligence</a>
          <a className="hover:text-brand-cyan transition-colors" href="#">Network</a>
        </nav>

        <div className="flex-1 flex justify-end">
          <button
            onClick={() => navigate('/repoinput')}
            className="text-[11px] md:text-sm font-black uppercase tracking-widest px-6 md:px-10 py-3 md:py-4.5 border border-white/10 rounded-full hover:border-brand-cyan/50 hover:bg-brand-cyan/5 transition-all shadow-xl shadow-brand-cyan/5"
          >
            Terminal Access
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 w-full max-w-7xl px-8 pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center mx-auto text-center min-h-screen">
        <div
          className={`transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} flex flex-col items-center`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-12 border border-brand-cyan/20 rounded-full bg-brand-cyan/5 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-cyan"></span>
            </span>
            <span className="text-brand-cyan text-[11px] font-black uppercase tracking-[0.3em]">System Status: v1.0.4 Online</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[1.1] uppercase mb-12 font-display">
            The World's <br />
            Next <span className="text-brand-cyan italic">Gen</span> <br />
            Engine
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-zinc-500 max-w-3xl mx-auto mb-20 font-medium leading-relaxed tracking-tight">
            Advanced codebase intelligence for engineers. Deconstruct, analyze,
            and visualize complex systems at the speed of thought.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate('/repoinput')}
              className="group relative px-16 py-6 bg-brand-cyan text-black font-black text-[13px] uppercase tracking-[0.3em] rounded-full hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-brand-cyan/20 overflow-hidden"
            >
              <span className="relative z-10">Try it out — Now</span>
            </button>
            <button className="px-16 py-6 border border-white/5 bg-white/[0.02] backdrop-blur-md rounded-full text-zinc-400 text-[13px] font-black uppercase tracking-[0.3em] hover:text-white hover:border-white/20 transition-all">
              Read Manifesto
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-12 mt-[35rem] w-full transition-all duration-[1500ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          {features.map((f, i) => (
            <div key={i} className={`p-10 border border-white/5 bg-white/[0.02] rounded-3xl text-center items-center hover:border-brand-cyan/20 transition-ui group aspect-[16/10] flex flex-col justify-center stagger-child stagger-${i + 1}`} style={{ opacity: mounted ? 1 : 0, animationDelay: mounted ? `${150 + i * 80}ms` : '0ms' }}>
              <div className="mb-6 p-4 border border-white/10 rounded-2xl w-fit group-hover:scale-110 transition-transform mx-auto">
                {f.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 font-display">{f.title}</h3>
              <p className="text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors max-w-[85%]">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-zinc-600 font-black uppercase tracking-widest">
          <div>© 2026 CodeLens Labs. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-cyan">Privacy</a>
            <a href="#" className="hover:text-brand-cyan">Security</a>
            <a href="#" className="hover:text-brand-cyan">Protocols</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
