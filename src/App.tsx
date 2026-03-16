import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { lazy, Suspense } from 'react';
import { beforeSendFilter, useAnalytics } from '@/hooks/useAnalytics';

// Retry dynamic imports once on failure (handles stale service worker cache)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyRetry(importFn: () => Promise<any>) {
  return lazy(() =>
    importFn().catch(() => {
      const reloaded = sessionStorage.getItem('chunk-reload');
      if (!reloaded) {
        sessionStorage.setItem('chunk-reload', '1');
        window.location.reload();
        return new Promise(() => {}); // never resolves — page is reloading
      }
      sessionStorage.removeItem('chunk-reload');
      return importFn();
    }),
  );
}

// Lazy-load all pages for code splitting (with stale-cache recovery)
const OverviewPage = lazyRetry(() => import('@/pages/OverviewPage'));
const MaxwellPage = lazyRetry(() => import('@/pages/MaxwellPage'));
const GaussPage = lazyRetry(() => import('@/pages/GaussPage'));
const CoulombPage = lazyRetry(() => import('@/pages/CoulombPage'));
const AmperePage = lazyRetry(() => import('@/pages/AmperePage'));
const LorentzPage = lazyRetry(() => import('@/pages/LorentzPage'));
const FaradayPage = lazyRetry(() => import('@/pages/FaradayPage'));
const LenzPage = lazyRetry(() => import('@/pages/LenzPage'));
const EMWavePage = lazyRetry(() => import('@/pages/EMWavePage'));
const PolarizationPage = lazyRetry(() => import('@/pages/PolarizationPage'));
const MagneticCircuitsPage = lazyRetry(() => import('@/pages/MagneticCircuitsPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-3 border-engineering-blue-500 border-t-transparent rounded-full animate-spin mx-auto" role="status" aria-label="Loading" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading module...</p>
      </div>
    </div>
  );
}

export default function App() {
  useAnalytics();

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
          <Route
            path="magnetic-circuits"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <MagneticCircuitsPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>
      </Routes>
      <Analytics beforeSend={beforeSendFilter} />
    </BrowserRouter>
  );
}
