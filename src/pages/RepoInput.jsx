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
        <header className="flex items-center justify-between px-12 py-8 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-[#48E5C2]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2a10 10 0 0 1 8 4" />
                <path d="M12 18a6 6 0 0 0 6-6c0-1.65-.67-3.15-1.76-4.24" />
                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              </svg>
              <span className="text-xl font-bold tracking-tight">CodeLens</span>
            </div>
            <span className="bg-[#48E5C2]/20 text-[#48E5C2] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-[#48E5C2]/30">Beta</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A1A1AA]">
            <a className="hover:text-white transition-colors" href="#">Product</a>
            <a className="hover:text-white transition-colors" href="#">Docs</a>
            <a className="hover:text-white transition-colors" href="#">Pricing</a>
          </nav>

          <div className="flex items-center gap-6">
            <a className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors hidden sm:block" href="#">Login</a>
            <button className="bg-[#48E5C2] text-[#0B1215] text-sm font-bold px-5 py-2.5 rounded hover:bg-opacity-90 transition-all" style={{ boxShadow: '0 0 20px rgba(72, 229, 194, 0.4)' }}>
              Try CodeLens
            </button>
          </div>
        </header>
      </div>

      {/* Hero Container */}
      <main className="relative z-10 w-full max-w-5xl px-6 py-24 flex flex-col items-center justify-center min-h-[70vh] mx-auto">
        
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }} className="flex flex-col items-center w-full">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-center w-full">
            Understand <span className="text-[#48E5C2]">any codebase</span> instantly
          </h1>
          <p className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl text-center mb-16 leading-relaxed">
            AI-powered interactive maps, dependency graphs, and chat for GitHub repositories.
          </p>

          {/* Form Row */}
          <div className="w-full max-w-3xl mb-32">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <div className={`relative flex-grow rounded-full border bg-[#0B1215] transition-all duration-300 flex items-center ${isFocused ? 'border-[#48E5C2] shadow-[0_0_20px_rgba(72,229,194,0.2)]' : 'border-[#48E5C2]/30'}`}>
                <div className="absolute left-6 text-[#A1A1AA]">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd" />
                  </svg>
                </div>
                <input 
                  ref={inputRef}
                  value={repoUrl}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-transparent border-none text-white pl-20 pr-8 py-5 rounded-full focus:ring-0 placeholder-[#A1A1AA] text-lg outline-none" 
                  placeholder="https://github.com/owner/repo" 
                />
              </div>
              <button 
                onClick={handleSubmit}
                className="px-10 py-5 bg-[#48E5C2] text-[#0B1215] font-bold text-lg rounded-full flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all shadow-[0_0_30px_rgba(72,229,194,0.4)] whitespace-nowrap leading-none"
              >
                Analyze Repository
                <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
            {error && (
              <p className="mt-4 text-red-400 text-sm font-medium text-center animate-fade-in">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Example Grid */}
        <div className="w-full mt-12" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 0.4s' }}>
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="h-px bg-white/10 flex-grow max-w-[100px]" />
            <h2 className="text-xl font-bold text-white uppercase tracking-widest text-center">Try an example</h2>
            <div className="h-px bg-white/10 flex-grow max-w-[100px]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {EXAMPLE_REPOS.map((repo) => (
              <div 
                key={repo.slug}
                onClick={() => handleExampleClick(repo.slug)}
                className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-10 hover:bg-white/[0.05] hover:border-[#48E5C2]/40 transition-all duration-300 cursor-pointer text-left"
              >
                <div className="flex items-center gap-3 mb-6">
                  {repo.icon}
                  <h3 className="font-bold text-xl tracking-tight">
                    <span className="text-[#A1A1AA] font-normal">{repo.owner} / </span>
                    {repo.repo}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {repo.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black tracking-widest bg-[#48E5C2]/10 text-[#48E5C2] px-3 py-1.5 rounded-full border border-[#48E5C2]/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                  {repo.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full relative z-20 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-10 py-12 flex flex-col md:flex-row justify-between items-center text-sm text-[#A1A1AA] font-medium">
          <div className="flex gap-8 mb-6 md:mb-0">
            <a className="hover:text-white transition-colors" href="#">Company</a>
            <a className="hover:text-white transition-colors" href="#">Product</a>
            <a className="hover:text-white transition-colors" href="#">Resources</a>
            <a className="hover:text-white transition-colors" href="#">Legal</a>
          </div>
          <div>
            © 2024 CodeLens Inc. · All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
