import styles from './ErrorMessage.module.css';

function ErrorMessage({ message = "Ocorreu um erro", onRetry }) {
  return (
    <div className={styles.error}>
      <div className={styles.errorIcon}>
        ⚠️
      </div>
      <div className={styles.errorContent}>
        <h3 className={styles.errorTitle}>Erro ao carregar dados</h3>
        <p className={styles.errorMessage}>{message}</p>
        {onRetry && (
          <button className={styles.retryButton} onClick={onRetry}>
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;