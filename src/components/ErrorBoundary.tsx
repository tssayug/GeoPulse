import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-dark-bg text-gray-400 font-mono border border-dark-alert/30 rounded-lg">
          <ShieldAlert size={48} className="text-dark-alert mb-4 animate-pulse" />
          <h2 className="text-lg font-bold text-gray-200 mb-2 uppercase tracking-widest">System Failure Detected</h2>
          <p className="text-xs text-center max-w-xs mb-6 opacity-60">
            A critical error occurred while rendering this sector. Tactical fail-safes have been engaged.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 bg-dark-accent/10 hover:bg-dark-accent/20 border border-dark-accent/30 text-dark-accent px-4 py-2 rounded uppercase text-xs font-bold transition-all"
          >
            <RefreshCcw size={14} /> Re-Initialize Sector
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
