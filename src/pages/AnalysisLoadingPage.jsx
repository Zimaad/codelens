/**
 * AnalysisLoadingPage — route-level wrapper that drives AnalysisLoading.
 *
 * In production, replace the simulated timer with real SSE/WebSocket events
 * that update `currentStep` as each backend stage completes.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnalysisLoading from './AnalysisLoading';

const ANALYSIS_STEPS = [
  'Cloning repository',
  'Walking file tree',
  'Parsing AST structure',
  'Generating embeddings',
  'Building dependency graph',
  'Summarizing files',
];

// Simulated duration per step (ms) — replace with real SSE events
const STEP_DURATIONS = [1200, 1000, 1400, 1800, 1600, 1400];

export default function AnalysisLoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { repoUrl, repoId } = location.state || {
    repoUrl: 'https://github.com/example/repo',
    repoId: 'example-repo',
  };

  const [currentStep, setCurrentStep] = useState(0);

  // Simulate step progression — swap this out for SSE event listener
  useEffect(() => {
    if (currentStep >= ANALYSIS_STEPS.length) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, STEP_DURATIONS[currentStep]);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleComplete = useCallback(() => {
    navigate(`/explore/${repoId}`, { replace: true });
  }, [navigate, repoId]);

  return (
    <AnalysisLoading
      steps={ANALYSIS_STEPS}
      currentStep={currentStep}
      repoUrl={repoUrl}
      onComplete={handleComplete}
    />
  );
}
