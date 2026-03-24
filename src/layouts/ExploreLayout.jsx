import Sidebar from '../components/Sidebar';

export default function ExploreLayout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <Sidebar />
      <main
        className="flex-1 min-w-0 overflow-hidden"
        style={{ marginLeft: '260px', minHeight: '100vh' }}
      >
        {children}
      </main>
    </div>
  );
}
