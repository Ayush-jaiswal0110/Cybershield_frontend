import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="glass p-8 rounded-xl shadow-md max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
              <p className="text-white/80 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
