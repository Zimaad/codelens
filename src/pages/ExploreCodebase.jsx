import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import FileTree from '../components/FileTree';
import DependencyGraph from '../components/DependencyGraph';
import FileDetailPanel from '../components/FileDetailPanel';
import ChatInterface from '../components/ChatInterface';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const SAMPLE_FILES = [
  { path: 'src/index.tsx', summary: 'Application entry point — renders root React component', language: 'typescript', importance: 'high' },
  { path: 'src/App.tsx', summary: 'Root component with router and global providers', language: 'typescript', importance: 'high' },
  { path: 'src/hooks/useAuth.ts', summary: 'Authentication hook with login/logout and session management', language: 'typescript', importance: 'high' },
  { path: 'src/hooks/useTheme.ts', summary: 'Theme management hook for dark/light mode toggle', language: 'typescript', importance: 'low' },
  { path: 'src/utils/helpers.ts', summary: 'Shared utility functions: debounce, throttle, deep merge', language: 'typescript', importance: 'medium' },
  { path: 'src/utils/api.ts', summary: 'Axios client wrapper with interceptors and retry logic', language: 'typescript', importance: 'high' },
  { path: 'src/components/Button.tsx', summary: 'Reusable button component with multiple variants', language: 'typescript', importance: 'low' },
  { path: 'src/components/Modal.tsx', summary: 'Accessible modal dialog with focus trap', language: 'typescript', importance: 'medium' },
  { path: 'src/components/Header.tsx', summary: 'Global header with navigation and user menu', language: 'typescript', importance: 'medium' },
  { path: 'src/pages/Dashboard.tsx', summary: 'Main dashboard with analytics widgets and charts', language: 'typescript', importance: 'high' },
  { path: 'src/pages/Settings.tsx', summary: 'User settings and preferences management page', language: 'typescript', importance: 'medium' },
  { path: 'src/styles/globals.css', summary: 'Global CSS resets and custom property definitions', language: 'css', importance: 'low' },
  { path: 'package.json', summary: 'Project dependencies, scripts, and metadata', language: 'json', importance: 'medium' },
  { path: 'tsconfig.json', summary: 'TypeScript compiler configuration', language: 'json', importance: 'low' },
  { path: 'README.md', summary: 'Project overview, setup instructions, and API docs', language: 'md', importance: 'low' },
  { path: 'server/main.py', summary: 'FastAPI server entry point with CORS and middleware', language: 'python', importance: 'high' },
  { path: 'server/routes/auth.py', summary: 'Authentication endpoints: login, register, refresh', language: 'python', importance: 'high' },
  { path: 'server/routes/data.py', summary: 'CRUD endpoints for core data resources', language: 'python', importance: 'medium' },
  { path: 'server/models/user.py', summary: 'SQLAlchemy User model with password hashing', language: 'python', importance: 'medium' },
  { path: 'server/utils/db.py', summary: 'Database connection pool and session management', language: 'python', importance: 'high' },
];

const GRAPH_NODES = [
  { id: 'src/index.tsx', label: 'index.tsx', language: 'typescript', inDegree: 1 },
  { id: 'src/App.tsx', label: 'App.tsx', language: 'typescript', inDegree: 5 },
  { id: 'src/hooks/useAuth.ts', label: 'useAuth', language: 'typescript', inDegree: 4 },
  { id: 'src/hooks/useTheme.ts', label: 'useTheme', language: 'typescript', inDegree: 2 },
  { id: 'src/utils/helpers.ts', label: 'helpers', language: 'typescript', inDegree: 6 },
  { id: 'src/utils/api.ts', label: 'api', language: 'typescript', inDegree: 5 },
  { id: 'src/components/Button.tsx', label: 'Button', language: 'typescript', inDegree: 3 },
  { id: 'src/components/Modal.tsx', label: 'Modal', language: 'typescript', inDegree: 3 },
  { id: 'src/components/Header.tsx', label: 'Header', language: 'typescript', inDegree: 2 },
  { id: 'src/pages/Dashboard.tsx', label: 'Dashboard', language: 'typescript', inDegree: 4 },
  { id: 'src/pages/Settings.tsx', label: 'Settings', language: 'typescript', inDegree: 2 },
  { id: 'server/main.py', label: 'main.py', language: 'python', inDegree: 5 },
  { id: 'server/routes/auth.py', label: 'auth.py', language: 'python', inDegree: 3 },
  { id: 'server/utils/db.py', label: 'db.py', language: 'python', inDegree: 4 },
];

const GRAPH_EDGES = [
  { source: 'src/index.tsx', target: 'src/App.tsx' },
  { source: 'src/App.tsx', target: 'src/pages/Dashboard.tsx' },
  { source: 'src/App.tsx', target: 'src/pages/Settings.tsx' },
  { source: 'src/App.tsx', target: 'src/hooks/useAuth.ts' },
  { source: 'src/App.tsx', target: 'src/hooks/useTheme.ts' },
  { source: 'src/pages/Dashboard.tsx', target: 'src/utils/api.ts' },
  { source: 'src/pages/Dashboard.tsx', target: 'src/utils/helpers.ts' },
  { source: 'src/pages/Dashboard.tsx', target: 'src/components/Button.tsx' },
  { source: 'src/pages/Dashboard.tsx', target: 'src/components/Modal.tsx' },
  { source: 'src/pages/Settings.tsx', target: 'src/utils/api.ts' },
  { source: 'src/pages/Settings.tsx', target: 'src/hooks/useAuth.ts' },
  { source: 'src/components/Header.tsx', target: 'src/hooks/useAuth.ts' },
  { source: 'src/components/Header.tsx', target: 'src/components/Button.tsx' },
  { source: 'src/components/Modal.tsx', target: 'src/components/Button.tsx' },
  { source: 'src/utils/api.ts', target: 'src/utils/helpers.ts' },
  { source: 'server/main.py', target: 'server/routes/auth.py' },
  { source: 'server/main.py', target: 'server/utils/db.py' },
  { source: 'server/routes/auth.py', target: 'server/utils/db.py' },
  { source: 'src/hooks/useAuth.ts', target: 'src/utils/api.ts' },
  { source: 'src/utils/helpers.ts', target: 'src/hooks/useTheme.ts' },
];

/* Enriched file details keyed by path */
const FILE_DETAILS = {
  'src/utils/api.ts': {
    path: 'src/utils/api.ts', summary: 'Axios HTTP client wrapper with request/response interceptors, automatic retry logic, and typed error handling. Provides get, post, put, delete helpers that are used throughout the application.', language: 'typescript', importance: 'high',
    functions: [
      { name: 'createClient', args: ['baseURL', 'options'], docstring: 'Creates a configured Axios instance with interceptors', line: 12 },
      { name: 'handleError', args: ['error'], docstring: 'Normalizes API errors into a consistent shape', line: 45 },
      { name: 'retryRequest', args: ['config', 'retries'], docstring: 'Retries failed requests with exponential backoff', line: 78 },
    ],
    classes: [],
    imports: ['axios', 'src/utils/helpers.ts', 'src/hooks/useAuth.ts'],
  },
  'server/main.py': {
    path: 'server/main.py', summary: 'FastAPI application entry point. Configures CORS, mounts routers, and initializes middleware for logging and error handling. Connects to the database on startup.', language: 'python', importance: 'high',
    functions: [
      { name: 'create_app', args: [], docstring: 'Factory function that builds and configures the FastAPI app', line: 8 },
      { name: 'on_startup', args: [], docstring: 'Runs on server start — initializes DB pool', line: 32 },
      { name: 'on_shutdown', args: [], docstring: 'Gracefully closes DB connections', line: 48 },
    ],
    classes: [
      { name: 'AppConfig', methods: ['from_env', 'validate', 'to_dict'] },
    ],
    imports: ['fastapi', 'uvicorn', 'server/routes/auth.py', 'server/routes/data.py', 'server/utils/db.py'],
  },
  'src/hooks/useAuth.ts': {
    path: 'src/hooks/useAuth.ts', summary: 'React hook that manages authentication state including login, logout, token refresh, and session persistence via localStorage. Provides an AuthContext for child components.', language: 'typescript', importance: 'high',
    functions: [
      { name: 'useAuth', args: [], docstring: 'Main hook — returns user, login, logout, isAuthenticated', line: 15 },
      { name: 'refreshToken', args: ['token'], docstring: 'Calls the refresh endpoint to get a new access token', line: 56 },
      { name: 'persistSession', args: ['user', 'token'], docstring: 'Saves session data to localStorage', line: 82 },
    ],
    classes: [],
    imports: ['react', 'src/utils/api.ts'],
  },
  'src/pages/Dashboard.tsx': {
    path: 'src/pages/Dashboard.tsx', summary: 'Main application dashboard featuring analytics widgets, data charts, and summary cards. Fetches data on mount and refreshes every 30 seconds.', language: 'typescript', importance: 'high',
    functions: [
      { name: 'Dashboard', args: [], docstring: 'Root dashboard component with grid layout', line: 12 },
      { name: 'useDashboardData', args: ['interval'], docstring: 'Custom hook that polls API for dashboard metrics', line: 45 },
    ],
    classes: [],
    imports: ['react', 'src/utils/api.ts', 'src/utils/helpers.ts', 'src/components/Button.tsx', 'src/components/Modal.tsx'],
  },
  'server/models/user.py': {
    path: 'server/models/user.py', summary: 'SQLAlchemy ORM model for the User table. Includes password hashing via bcrypt, email validation, and role-based permissions.', language: 'python', importance: 'medium',
    functions: [
      { name: 'hash_password', args: ['raw_password'], docstring: 'Hashes a plaintext password using bcrypt', line: 22 },
      { name: 'verify_password', args: ['raw', 'hashed'], docstring: 'Compares a plaintext password against its hash', line: 30 },
    ],
    classes: [
      { name: 'User', methods: ['__repr__', 'set_password', 'check_password', 'to_dict', 'from_dict'] },
      { name: 'UserRole', methods: ['is_admin', 'is_editor'] },
    ],
    imports: ['sqlalchemy', 'bcrypt', 'server/utils/db.py'],
  },
  'src/App.tsx': {
    path: 'src/App.tsx', summary: 'Root React component that configures React Router, wraps the app in global providers (AuthProvider, ThemeProvider), and defines route-to-page mappings.', language: 'typescript', importance: 'high',
    functions: [
      { name: 'App', args: [], docstring: 'Root component with route definitions', line: 8 },
    ],
    classes: [],
    imports: ['react', 'react-router-dom', 'src/hooks/useAuth.ts', 'src/hooks/useTheme.ts', 'src/pages/Dashboard.tsx', 'src/pages/Settings.tsx'],
  },
  'src/utils/helpers.ts': {
    path: 'src/utils/helpers.ts', summary: 'Collection of general-purpose utility functions used across the codebase: debounce, throttle, deep merge, date formatting, and string manipulation helpers.', language: 'typescript', importance: 'medium',
    functions: [
      { name: 'debounce', args: ['fn', 'ms'], docstring: 'Creates a debounced version of the given function', line: 5 },
      { name: 'throttle', args: ['fn', 'ms'], docstring: 'Creates a throttled version of the given function', line: 22 },
      { name: 'deepMerge', args: ['target', '...sources'], docstring: 'Recursively merges source objects into target', line: 40 },
      { name: 'formatDate', args: ['date', 'format'], docstring: 'Formats a Date object into a readable string', line: 65 },
    ],
    classes: [],
    imports: ['src/hooks/useTheme.ts'],
  },
  'server/routes/auth.py': {
    path: 'server/routes/auth.py', summary: 'FastAPI router defining authentication endpoints: login (JWT token issuance), registration with email verification, and token refresh.', language: 'python', importance: 'high',
    functions: [
      { name: 'login', args: ['credentials'], docstring: 'Authenticates user and returns JWT access + refresh token', line: 12 },
      { name: 'register', args: ['user_data'], docstring: 'Creates a new user account with email verification', line: 38 },
      { name: 'refresh', args: ['refresh_token'], docstring: 'Issues a new access token using a valid refresh token', line: 64 },
    ],
    classes: [],
    imports: ['fastapi', 'server/utils/db.py', 'server/models/user.py'],
  },
  'server/utils/db.py': {
    path: 'server/utils/db.py', summary: 'Database connection management using SQLAlchemy. Creates an async engine, manages connection pools, and provides session factories.', language: 'python', importance: 'high',
    functions: [
      { name: 'create_engine', args: ['url', 'pool_size'], docstring: 'Creates an async SQLAlchemy engine', line: 10 },
      { name: 'get_session', args: [], docstring: 'Yields a database session for dependency injection', line: 28 },
    ],
    classes: [
      { name: 'Database', methods: ['connect', 'disconnect', 'health_check'] },
    ],
    imports: ['sqlalchemy', 'asyncio'],
  },
};

/* Simulated AI responses for chat */
const SIMULATED_RESPONSES = {
  'What does this repo do?': {
    text: 'This repository is a **full-stack web application** built with a TypeScript React frontend and a Python FastAPI backend. The frontend provides a dashboard with analytics, user settings, and authentication flows. The backend exposes REST endpoints for `auth`, `data CRUD`, and connects to a PostgreSQL database via SQLAlchemy.',
    citations: [
      { file: 'src/App.tsx', line: 1 },
      { file: 'server/main.py', line: 8 },
    ],
  },
  'Where should I start reading?': {
    text: 'Start with these key entry points:\n\n1. **Frontend**: `src/index.tsx` boots the React app and mounts `App.tsx`, which defines all routes\n2. **Backend**: `server/main.py` creates the FastAPI app and registers routers\n3. **Auth flow**: `src/hooks/useAuth.ts` on the client and `server/routes/auth.py` on the server handle the full login lifecycle',
    citations: [
      { file: 'src/index.tsx', line: 1 },
      { file: 'src/App.tsx', line: 12 },
      { file: 'server/main.py', line: 8 },
    ],
  },
  'What are the main entry points?': {
    text: 'There are two main entry points:\n\n• **Frontend**: `src/index.tsx` renders the root React component wrapped in `BrowserRouter`\n• **Backend**: `server/main.py` defines `create_app()` which initializes FastAPI with CORS, mounts all route modules, and connects to the database on startup',
    citations: [
      { file: 'src/index.tsx', line: 1 },
      { file: 'server/main.py', line: 8 },
    ],
  },
  'How is authentication handled?': {
    text: 'Authentication uses a **JWT token flow**:\n\n1. The `useAuth` hook in `src/hooks/useAuth.ts` manages client-side state — login, logout, and token persistence via `localStorage`\n2. `server/routes/auth.py` exposes `/login`, `/register`, and `/refresh` endpoints\n3. The `api.ts` client automatically attaches the token to requests via an Axios interceptor and handles `401` responses by calling `refreshToken()`',
    citations: [
      { file: 'src/hooks/useAuth.ts', line: 15 },
      { file: 'server/routes/auth.py', line: 1 },
      { file: 'src/utils/api.ts', line: 12 },
    ],
  },
};

/* ==========================================================================
   EXPLORE CODEBASE PAGE
   ========================================================================== */

const GROQ_KEYS = [
  import.meta.env.VITE_GROQ_API_KEY1,
  import.meta.env.VITE_GROQ_API_KEY2,
  import.meta.env.VITE_GROQ_API_KEY3,
].filter(Boolean);

let currentKeyIndex = 0;

export default function ExploreCodebase() {
  const { owner, repo } = useParams();
  const location = useLocation();
  const currentView = new URLSearchParams(location.search).get('view') || 'overview';

  // --- State ---
  const [repoFiles, setRepoFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [detailFile, setDetailFile] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [repoReadme, setRepoReadme] = useState('');

  // --- Graph Generation ---
  const graphData = useMemo(() => {
    const nodesMap = new Map();
    const edgesMap = new Set();
    const edges = [];
    
    const maxFiles = repoFiles.slice(0, 150);
    
    for (const file of maxFiles) {
      const parts = file.path.split('/');
      let currentPath = '';
      for (let i = 0; i < parts.length; i++) {
        const isFile = i === parts.length - 1;
        const part = parts[i];
        const prevPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!nodesMap.has(currentPath)) {
          if (nodesMap.size > 250) break;
          nodesMap.set(currentPath, {
            id: currentPath,
            label: part,
            language: isFile ? file.language || 'text' : 'folder',
            inDegree: 0,
            isFile
          });
        }
        
        if (prevPath) {
          const edgeId = `${prevPath}->${currentPath}`;
          if (!edgesMap.has(edgeId)) {
             edgesMap.add(edgeId);
             edges.push({ source: prevPath, target: currentPath });
             const targetNode = nodesMap.get(currentPath);
             if (targetNode) targetNode.inDegree += 1;
          }
        }
      }
    }
    return { nodes: Array.from(nodesMap.values()), edges };
  }, [repoFiles]);

  useEffect(() => {
    if (!owner || !repo) return;
    async function fetchRepoTree() {
      try {
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!repoRes.ok) throw new Error('Repo not found');
        const repoInfo = await repoRes.json();
        
        const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${repoInfo.default_branch}?recursive=1`);
        if (!treeRes.ok) throw new Error('Tree not found');
        const treeInfo = await treeRes.json();
        
        try {
          const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
            headers: { Accept: 'application/vnd.github.v3.raw' }
          });
          if (readmeRes.ok) {
            setRepoReadme(await readmeRes.text());
          } else {
            setRepoReadme(repoInfo.description || '');
          }
        } catch (e) {
          setRepoReadme(repoInfo.description || '');
        }
        
        if (treeInfo.tree) {
          const fetchedFiles = treeInfo.tree
            .filter((node) => node.type === 'blob')
            .map((node) => {
              const parts = node.path.split('.');
              const ext = parts.length > 1 ? parts[parts.length - 1] : '';
              return {
                path: node.path,
                summary: 'Fetched file from GitHub.',
                language: ext || 'unknown',
                importance: 'low',
              };
            });
          setRepoFiles(fetchedFiles);
        }
      } catch (err) {
        console.error('Failed to fetch github data', err);
      }
    }
    fetchRepoTree();
  }, [owner, repo]);

  // --- Handlers ---
  const selectFile = useCallback((filePath) => {
    setSelectedFile(filePath);
    const detail = FILE_DETAILS[filePath] || null;
    if (detail) {
      setDetailFile(detail);
      setIsDetailOpen(true);
    } else {
      const basic = repoFiles.find((f) => f.path === filePath);
      if (basic) {
        setDetailFile({ ...basic, functions: [], classes: [], imports: [] });
        setIsDetailOpen(true);
      }
    }
  }, []);

  const handleTreeFileSelect = useCallback((file) => {
    selectFile(file.path);
  }, [selectFile]);

  const handleGraphNodeSelect = useCallback((nodeId) => {
    selectFile(nodeId);
  }, [selectFile]);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const handleNavigateTo = useCallback((filePath) => {
    selectFile(filePath);
  }, [selectFile]);

  const handleChatNavigate = useCallback((file, line) => {
    selectFile(file);
  }, [selectFile]);

  const handleSendMessage = useCallback(async (text) => {
    const newUserMsg = { role: 'user', text };
    setChatMessages((prev) => [...prev, newUserMsg]);
    setChatLoading(true);

    const latestMessages = [...chatMessages, newUserMsg];
    
    const filePaths = repoFiles.map(f => f.path).slice(0, 100).join('\n');
    const contextStr = repoReadme ? `\n\nREADME or Description:\n${repoReadme.substring(0, 3000)}` : '';
    
    const apiMessages = [
      { role: 'system', content: `You are a codebase explainer AI. The user is asking about the ${owner}/${repo} repository. The repository contains ${repoFiles.length} files.\n\nHere are some of the tracked files:\n${filePaths}${contextStr}\n\nProvide clear, technical, and concise answers based on the context provided.` },
      ...latestMessages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text
      }))
    ].filter(m => m.content && m.content.trim().length > 0);

    try {
      if (GROQ_KEYS.length === 0) {
        throw new Error('No Groq API keys found. Please add them to the .env file.');
      }
      
      const apiKey = GROQ_KEYS[currentKeyIndex];
      // Rotate key
      currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: apiMessages,
          stream: false // Using non-streaming for simplicity and reliability with basic fetch, wait, I can simulate streaming or just show it instantly.
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq API Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const content = data.choices[0]?.message?.content || '';

      const words = content.split(' ');
      let current = '';
      let idx = 0;

      const streamingMsg = { role: 'ai', text: '', citations: [] };
      setChatMessages((prev) => [...prev, streamingMsg]);

      // Simple pseudo-streaming so the UI still looks cool
      const interval = setInterval(() => {
        if (idx < words.length) {
          current += (idx > 0 ? ' ' : '') + words[idx];
          idx++;
          setChatMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...streamingMsg, text: current };
            return updated;
          });
        } else {
          clearInterval(interval);
          setChatMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'ai', text: content, citations: [] };
            return updated;
          });
          setChatLoading(false);
        }
      }, 30);

    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { role: 'ai', text: `Error: ${err.message}`, citations: [] }]);
      setChatLoading(false);
    }
  }, [chatMessages, owner, repo, repoFiles.length]);

  // --- Render ---
  return (
    <div className="flex h-full animate-fade-in bg-[var(--color-bg-primary)]">
      {/* ===== Left: FileTree ===== */}
      <aside
        className="flex-shrink-0 h-full bg-[#0C1215]/50 backdrop-blur-md"
        style={{
          width: '280px',
          borderRight: '1px solid var(--color-border-subtle)',
        }}
      >
        <FileTree
          files={repoFiles}
          onFileSelect={handleTreeFileSelect}
          activeFile={selectedFile}
        />
      </aside>

      {/* ===== Center: Tabbed main area ===== */}
      <div className="flex-1 flex flex-col min-w-0 bg-grid">
        {/* Tab bar / Page Header */}
        <header className="flex-shrink-0 px-8 py-6 border-b border-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-white font-display">
                {owner}<span className="text-brand-cyan/40 px-1">/</span>{repo}
              </h1>
              <p className="text-xs text-zinc-500 font-medium">
                {repoFiles.length} files scanned · {graphData.edges.length} relationships mapped
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/5 text-brand-cyan text-[10px] font-black uppercase tracking-widest border border-brand-cyan/20">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                Live Analysis
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic content area */}
        <main className="flex-1 relative overflow-hidden">
          {currentView === 'dependencies' || currentView === 'architecture' ? (
            <div className="absolute inset-0 p-8">
              <div className="w-full h-full bg-[#0C1215]/30 rounded-3xl border border-white/5 overflow-hidden">
                <DependencyGraph
                  nodes={graphData.nodes}
                  edges={graphData.edges}
                  onNodeSelect={handleGraphNodeSelect}
                />
              </div>
            </div>
          ) : currentView === 'insights' ? (
            <div className="absolute inset-0">
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onNavigateTo={handleChatNavigate}
                isLoading={chatLoading}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
              <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 bg-gradient-to-br from-brand-cyan/10 to-brand-indigo/10 border border-brand-cyan/20 shadow-2xl shadow-brand-cyan/5">
                <svg className="w-8 h-8 text-brand-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white font-display tracking-tight">
                {currentView === 'overview' ? 'Architecture Overview' : 'Codebase Insights'}
              </h2>
              <p className="text-sm md:text-base text-zinc-500 max-w-sm mb-8 leading-relaxed">
                Repository <span className="text-white font-bold">{owner}/{repo}</span> is ready for exploration. 
                Select a file or use the AI to ask questions.
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:border-brand-cyan/20">
                   <div className="text-brand-cyan font-mono text-lg font-bold mb-1">{repoFiles.length}</div>
                   <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-black">Files</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:border-brand-cyan/20">
                   <div className="text-brand-cyan font-mono text-lg font-bold mb-1">{graphData.edges.length}</div>
                   <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-black">Links</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===== Right: FileDetailPanel ===== */}
      <FileDetailPanel
        file={detailFile}
        isOpen={isDetailOpen && detailFile !== null}
        onClose={handleCloseDetail}
        onNavigateTo={handleNavigateTo}
      />
    </div>

  );
}

/* ==========================================================================
   TAB ICONS
   ========================================================================== */

function GraphTabIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function ChatTabIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
