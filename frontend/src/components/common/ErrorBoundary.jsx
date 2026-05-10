import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error:    null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-10 text-center shadow-lg">

            <div className="text-5xl">⚠️</div>

            <h2 className="mt-4 text-2xl font-black text-slate-800">
              Something went wrong
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              An unexpected error occurred. Please refresh the page or
              try again later.
            </p>

            {/* Show error in dev mode only */}
            {process.env.NODE_ENV === 'development' && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-xs text-red-600">
                {this.state.error?.message}
              </p>
            )}

            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-2xl bg-blue-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Refresh Page
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="mt-3 block text-sm font-medium text-slate-400 hover:text-blue-600 transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;