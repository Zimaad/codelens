import Sidebar from '../components/Sidebar';

export default function ExploreLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Sidebar />
      <main
        className="flex-1 min-w-0 overflow-hidden relative"
        style={{ marginLeft: '260px', height: '100vh' }}
      >
        {children}
      </main>
    </div>
  );
}
