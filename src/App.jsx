import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ExploreLayout from './layouts/ExploreLayout';
import Landing from './pages/Landing';
import RepoInput from './pages/RepoInput';
import AnalysisLoadingPage from './pages/AnalysisLoadingPage';
import ExploreCodebase from './pages/ExploreCodebase';

export default function App() {
  const location = useLocation();

  // Scroll visibility management: Only show scrollbars when scrolling or hover
  useEffect(() => {
    let scrollTimeout;
    const scrollHandler = (e) => {
      // Find the element being scrolled (either root or a specific container)
      const target = e.target === document ? document.documentElement : e.target;
      if (target.classList) {
        target.classList.add('is-scrolling');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          target.classList.remove('is-scrolling');
        }, 1200);
      }
    };

    window.addEventListener('scroll', scrollHandler, true);
    return () => window.removeEventListener('scroll', scrollHandler, true);
  }, []);

  // Reset scroll on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/repoinput" element={<RepoInput />} />
      <Route path="/loading" element={<AnalysisLoadingPage />} />
      <Route
        path="/explore/:owner/:repo"
        element={
          <ExploreLayout>
            <ExploreCodebase />
          </ExploreLayout>
        }
      />
    </Routes>
  );
}
