import { useRouteError } from 'react-router-dom'

export const RouterError = () => {
  const error = useRouteError()

  // Handle different error types that useRouteError can return
  const errorMessage =
    error instanceof Error
      ? error.message
      : error instanceof Response
        ? `${error.status} ${error.statusText}`
        : typeof error === 'string'
          ? error
          : 'An unknown error occurred'

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Navigation Error</h1>
      <p style={styles.message}>The page could not be loaded.</p>
      <p style={styles.errorMessage}>{errorMessage}</p>
      <button style={styles.button} onClick={() => window.location.reload()}>
        Reload Application
      </button>
      <button style={styles.secondaryButton} onClick={() => window.history.back()}>
        Go Back
      </button>
    </div>
  )
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
    marginBottom: '1rem',
  },
  errorMessage: {
    fontSize: '1rem',
    color: '#757575',
    marginBottom: '2rem',
    fontFamily: 'monospace',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '0.5rem',
  },
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: 'transparent',
    color: '#1976d2',
    border: '1px solid #1976d2',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '0.5rem',
  },
}

export default RouterError
