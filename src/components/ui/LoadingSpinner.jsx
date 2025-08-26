import styles from './LoadingSpinner.module.css';

function LoadingSpinner() {
  return (
    <div className={styles.spinner}>
      <div className={styles.spinnerRing}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span className={styles.spinnerText}>Carregando...</span>
    </div>
  );
}

export default LoadingSpinner;