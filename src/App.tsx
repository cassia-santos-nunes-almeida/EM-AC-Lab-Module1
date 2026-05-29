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
const OverviewSection = lazyRetry(() => import('@/sections/overview').then((m) => ({ default: m.OverviewSection })));
const MaxwellSection = lazyRetry(() => import('@/sections/maxwell').then((m) => ({ default: m.MaxwellSection })));
const GaussSection = lazyRetry(() => import('@/sections/gauss').then((m) => ({ default: m.GaussSection })));
const CoulombSection = lazyRetry(() => import('@/sections/coulomb').then((m) => ({ default: m.CoulombSection })));
const AmpereSection = lazyRetry(() => import('@/sections/ampere').then((m) => ({ default: m.AmpereSection })));
const LorentzSection = lazyRetry(() => import('@/sections/lorentz').then((m) => ({ default: m.LorentzSection })));
const FaradaySection = lazyRetry(() => import('@/sections/faraday').then((m) => ({ default: m.FaradaySection })));
const LenzSection = lazyRetry(() => import('@/sections/lenz').then((m) => ({ default: m.LenzSection })));
const EMWaveSection = lazyRetry(() => import('@/sections/em-wave').then((m) => ({ default: m.EMWaveSection })));
const PolarizationSection = lazyRetry(() => import('@/sections/polarization').then((m) => ({ default: m.PolarizationSection })));
const MagneticCircuitsSection = lazyRetry(() => import('@/sections/magnetic-circuits').then((m) => ({ default: m.MagneticCircuitsSection })));

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
                  <OverviewSection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="maxwell"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <MaxwellSection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="gauss"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <GaussSection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="coulomb"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <CoulombSection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="ampere"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <AmpereSection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="lorentz"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <LorentzSection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="faraday"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <FaradaySection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="lenz"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <LenzSection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="em-wave"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <EMWaveSection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="polarization"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <PolarizationSection />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="magnetic-circuits"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <MagneticCircuitsSection />
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
