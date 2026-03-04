import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { lazy, Suspense } from 'react';

// Lazy-load all pages for code splitting
const OverviewPage = lazy(() => import('@/pages/OverviewPage'));
const MaxwellPage = lazy(() => import('@/pages/MaxwellPage'));
const GaussPage = lazy(() => import('@/pages/GaussPage'));
const CoulombPage = lazy(() => import('@/pages/CoulombPage'));
const AmperePage = lazy(() => import('@/pages/AmperePage'));
const LorentzPage = lazy(() => import('@/pages/LorentzPage'));
const FaradayPage = lazy(() => import('@/pages/FaradayPage'));
const LenzPage = lazy(() => import('@/pages/LenzPage'));
const EMWavePage = lazy(() => import('@/pages/EMWavePage'));
const PolarizationPage = lazy(() => import('@/pages/PolarizationPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-3 border-engineering-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading module...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <OverviewPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="maxwell"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <MaxwellPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="gauss"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <GaussPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="coulomb"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <CoulombPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="ampere"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <AmperePage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="lorentz"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <LorentzPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="faraday"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <FaradayPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="lenz"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <LenzPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="em-wave"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <EMWavePage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="polarization"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <PolarizationPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
