import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import HomePage from './pages/HomePage';

const WorkspacePage = lazy(() => import('./pages/WorkspacePage'));
const PrivacyPage = lazy(() => import('./pages/LegalPages').then((module) => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/LegalPages').then((module) => ({ default: module.TermsPage })));
const NotFoundPage = lazy(() => import('./pages/LegalPages').then((module) => ({ default: module.NotFoundPage })));

function RouteLoading() {
  return <main className="route-loading" role="status"><LoaderCircle size={18} className="spin" /> Opening atlas…</main>;
}

export default function App() {
  return <Suspense fallback={<RouteLoading />}><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/workspace" element={<WorkspacePage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Suspense>;
}
