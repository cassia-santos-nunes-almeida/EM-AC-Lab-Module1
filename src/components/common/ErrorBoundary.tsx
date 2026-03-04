import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

/**
 * 3-level error recovery boundary:
 * 1. Retry render (level 1)
 * 2. Reset state and retry (level 2)
 * 3. Navigate home (level 3)
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState((s) => ({
      hasError: false,
      error: null,
      errorCount: s.errorCount + 1,
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
          <AlertTriangle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred in this module.'}
          </p>
          <div className="flex gap-3">
            {this.state.errorCount < 2 && (
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-engineering-blue-600 text-white text-sm font-semibold hover:bg-engineering-blue-700 transition-colors"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            )}
            <button
              onClick={this.handleGoHome}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <Home size={16} />
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
