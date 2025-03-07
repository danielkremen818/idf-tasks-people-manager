
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error in component:', {
      module: 'ErrorBoundary',
      data: {
        error,
        componentStack: errorInfo.componentStack
      }
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md w-full">
            <div className="text-red-500 text-5xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 dark:text-white">אירעה שגיאה</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              אנא נסה לרענן את הדף או לחזור מאוחר יותר.
              {this.state.error && (
                <span className="block mt-2 text-sm text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-800">
                  {this.state.error.message}
                </span>
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={this.handleReset} variant="outline" className="flex-1">
                נסה שוב
              </Button>
              <Button onClick={this.handleReload} className="flex-1">
                רענן את הדף
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
