import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    // Error is logged to console by React in development
    // In production, consider logging to an error tracking service
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // Only show error details in development mode to avoid leaking implementation details
      const isDev = import.meta.env.DEV

      return (
        <div style={styles.container}>
          <h1 style={styles.heading}>Something went wrong</h1>
          <p style={styles.message}>The application encountered an unexpected error.</p>
          <button style={styles.button} onClick={() => window.location.reload()}>
            Reload Application
          </button>
          {isDev && this.state.error && (
            <details style={styles.details}>
              <summary style={styles.summary}>Error Details</summary>
              <pre style={styles.pre}>{this.state.error.toString()}</pre>
              <p style={styles.stack}>{this.state.error.stack}</p>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '2rem',
    textAlign: 'center' as const,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: '2rem',
    color: '#d32f2f',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.2rem',
    color: '#555',
    marginBottom: '2rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  details: {
    marginTop: '2rem',
    textAlign: 'left' as const,
    maxWidth: '800px',
  },
  summary: {
    cursor: 'pointer',
    color: '#1976d2',
    fontWeight: 'bold' as const,
  },
  pre: {
    whiteSpace: 'pre-wrap' as const,
    wordWrap: 'break-word' as const,
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  stack: {
    whiteSpace: 'pre-wrap' as const,
    wordWrap: 'break-word' as const,
    fontSize: '0.875rem',
    color: '#757575',
    marginTop: '1rem',
  },
}

export default ErrorBoundary
