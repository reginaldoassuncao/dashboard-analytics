import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContent}>
            <h2>⚠️ Algo deu errado</h2>
            <p>Ocorreu um erro inesperado. Tente recarregar a página.</p>
            <button 
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Recarregar página
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details className={styles.errorDetails}>
                <summary>Detalhes do erro (desenvolvimento)</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;