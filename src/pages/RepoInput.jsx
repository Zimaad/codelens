import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GITHUB_PATTERN = /^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+\/?$/;

const EXAMPLE_REPOS = [
  {
    slug: 'facebook/react',
    owner: 'facebook',
    repo: 'react',
    tags: ['UI LIBRARY', 'JAVASCRIPT'],
    desc: 'A JavaScript library for building user interfaces.',
    icon: (
      <svg className="w-8 h-8 text-[#61DAFB]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.2c-5.4 0-10 4.1-10 9.2s4.6 9.2 10 9.2 10-4.1 10-9.2-4.6-9.2-10-9.2zm0 17c-4.7 0-8.6-3.5-8.6-7.8S7.3 3.6 12 3.6s8.6 3.5 8.6 7.8-3.9 7.8-8.6 7.8z" />
        <circle cx="12" cy="11.4" r="2" />
      </svg>
    )
  },
  {
    slug: 'tiangolo/fastapi',
    owner: 'tiangolo',
    repo: 'fastapi',
    tags: ['PYTHON API', 'PYTHON'],
    desc: 'Modern, fast (high-performance), web framework for building APIs.',
    icon: (
      <svg className="w-8 h-8 text-[#009688]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  },
  {
    slug: 'kubernetes/kubernetes',
    owner: 'kubernetes',
    repo: 'kubernetes',
    tags: ['CONTAINER ORCHESTRATION', 'GO'],
    desc: 'Production-Grade Container Orchestration.',
    icon: (
      <svg className="w-8 h-8 text-[#326CE5]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )
  },
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
    if (e) e.preventDefault();
    setSubmitted(true);
    const err = validate(repoUrl);
    if (err) {
      setError(err);
      inputRef.current?.focus();
      return;
    }
    setError('');
    const match = repoUrl.trim().match(/github\.com\/([^/]+)\/([^/]+)/);
    const owner = match ? match[1] : 'example';
    const repo = match ? match[2].replace(/\.git$/, '').replace(/\/$/, '') : 'repo';
    navigate('/loading', { state: { repoUrl: repoUrl.trim(), owner, repo } });
  };

  const handleExampleClick = (slug) => {
    const url = `https://github.com/${slug}`;
    const match = slug.split('/');
    navigate('/loading', { state: { repoUrl: url, owner: match[0], repo: match[1] } });
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative font-sans bg-[#0B1215] text-white overflow-x-hidden m-0 p-0 items-center">
      {/* Background Styling */}
      <style>{`
        .bg-grid {
          background-image: 
            linear-gradient(rgba(72, 229, 194, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(72, 229, 194, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .line-horizontal {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(72,229,194,0.15), transparent);
          width: 40%;
        }
        .line-vertical {
          position: absolute;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(72,229,194,0.15), transparent);
          height: 40%;
        }
      `}</style>

      {/* Grid Overlay */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="line-horizontal top-32 left-10 opacity-50"></div>
        <div className="line-vertical top-10 left-32 opacity-50"></div>
        <div className="line-horizontal bottom-40 right-10 opacity-50"></div>
        <div className="line-vertical bottom-10 right-32 opacity-50"></div>
      </div>

      {/* Header Wrapper - Ensuring true center */}
      <div className="w-full relative z-20">
        <header className="flex items-center px-6 md:px-12 py-12 md:py-16 w-full">
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

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end gap-6 md:gap-10">
            <a className="text-xs md:text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors hidden sm:block" href="#">Sign In</a>
            <button className="bg-brand-cyan text-black text-[11px] md:text-sm font-black uppercase tracking-widest px-6 md:px-10 py-3 md:py-4.5 rounded-full hover:bg-white transition-all shadow-xl shadow-brand-cyan/20">
              Get Started
            </button>
          </div>
        </header>
      </div>

      {/* Hero Container */}
      <main className="relative z-10 w-full max-w-6xl px-8 py-20 md:py-32 flex flex-col items-center justify-center min-h-[65vh] md:min-h-[75vh] mx-auto">

        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(32px)', transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }} className="flex flex-col items-center w-full">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 md:mb-12 leading-[0.9] text-center w-full px-4 font-display uppercase">
            Analyze <span className="text-brand-cyan">Source</span> <br className="hidden md:block" /> at scale
          </h1>
          <p className="text-sm md:text-lg text-zinc-400 max-w-xl text-center mb-12 md:mb-20 leading-relaxed px-6 font-medium tracking-tight">
            High-fidelity interactive maps, multi-modal dependency graphs, and deconstructed intelligence for any GitHub repository.
          </p>

          {/* Form Row */}
          <div className="w-full max-w-3xl mb-32 md:mb-56 px-4 md:px-0">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <div className={`relative flex-grow rounded-full border bg-black/40 backdrop-blur-xl transition-ui form-input flex items-center h-14 md:h-16 ${isFocused ? 'border-brand-cyan shadow-2xl shadow-brand-cyan/10' : 'border-white/10'}`}>
                <div className="absolute left-5 md:left-6 text-zinc-600">
                  <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  value={repoUrl}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-transparent border-none text-white px-12 md:px-14 py-4 rounded-full focus:ring-0 placeholder-zinc-700 text-xs md:text-lg outline-none text-center font-bold tracking-tight"
                  placeholder="github.com/owner/repository"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="px-8 md:px-10 h-14 md:h-16 bg-brand-cyan text-black font-black text-[10px] md:text-xs uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-3 transition-ui shadow-2xl shadow-brand-cyan/20 whitespace-nowrap leading-none"
              >
                Launch Analysis
              </button>
            </form>
            {error && (
              <p className="mt-6 text-red-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-center animate-fade-in px-8">
                {error}
              </p>
            )}
          </div>
        </div>


        {/* Example Grid */}
        <div className="w-full mt-48 md:mt-72" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 0.6s' }}>
          <div className="flex items-center gap-6 mb-12 md:mb-20 justify-center px-8">
            <div className="h-px bg-white/5 flex-grow max-w-[80px] md:max-w-[140px]" />
            <h2 className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-[0.3em] text-center">Reference Targets</h2>
            <div className="h-px bg-white/5 flex-grow max-w-[80px] md:max-w-[140px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full px-4 md:px-0">
            {EXAMPLE_REPOS.map((repo) => (
              <div
                key={repo.slug}
                onClick={() => handleExampleClick(repo.slug)}
                className="group relative bg-[#0C1215]/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-10 hover:bg-[#0C1215]/80 hover:border-brand-cyan/30 transition-smooth cursor-pointer text-center overflow-hidden shadow-2xl md:aspect-[3/2] flex flex-col items-center justify-start"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-cyan/15 transition-all duration-700 pointer-events-none" />

                <div className="flex-grow flex flex-col items-center justify-center w-full relative z-10 -mt-4">
                  <div className="flex flex-col items-center gap-4 mb-5 w-full">
                    <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500 w-fit">
                      {repo.icon}
                    </div>
                    <h3 className="font-bold text-xl md:text-2xl tracking-tighter">
                      <span className="text-zinc-500 font-medium block text-sm mb-1 uppercase tracking-widest">{repo.owner}</span>
                      {repo.repo}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5 justify-center">
                    {repo.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black tracking-widest bg-brand-cyan/5 text-brand-cyan px-2.5 py-1 rounded-lg border border-brand-cyan/10 uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-medium opacity-60 group-hover:opacity-100 transition-opacity max-w-[90%] mx-auto">
                    {repo.desc}
                  </p>
                </div>

                <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 w-full relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan">View Intelligence</span>
                  <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full relative z-20 border-t border-white/5 mt-32 md:mt-48">
      </footer>


    </div>
  );
}
