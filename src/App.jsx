import { Routes, Route } from 'react-router-dom';
import ExploreLayout from './layouts/ExploreLayout';
import Landing from './pages/Landing';
import RepoInput from './pages/RepoInput';
import AnalysisLoadingPage from './pages/AnalysisLoadingPage';
import ExploreCodebase from './pages/ExploreCodebase';

export default function App() {
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
