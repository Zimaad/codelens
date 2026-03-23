import { Routes, Route } from 'react-router-dom';
import ExploreLayout from './layouts/ExploreLayout';
import RepoInput from './pages/RepoInput';
import AnalysisLoadingPage from './pages/AnalysisLoadingPage';
import ExploreCodebase from './pages/ExploreCodebase';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RepoInput />} />
      <Route path="/loading" element={<AnalysisLoadingPage />} />
      <Route
        path="/explore/:repoId"
        element={
          <ExploreLayout>
            <ExploreCodebase />
          </ExploreLayout>
        }
      />
    </Routes>
  );
}
