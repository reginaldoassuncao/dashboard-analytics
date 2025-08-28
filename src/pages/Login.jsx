import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoginForm from '../components/auth/LoginForm';
import { Sun, Moon } from 'lucide-react';
import styles from './Login.module.css';

function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to intended page after login
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError('');
      
      const result = await login(credentials);
      
      if (result.success) {
        // Success is handled by useEffect redirect
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.background}>
        <div className={styles.backgroundPattern}></div>
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>📊</div>
            <h1 className={styles.logoText}>Dashboard Analytics</h1>
          </div>
          
          <button 
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        <main className={styles.main}>
          <div className={styles.welcome}>
            <h2 className={styles.welcomeTitle}>
              Bem-vindo de volta! 👋
            </h2>
            <p className={styles.welcomeText}>
              Acesse seu dashboard completo com métricas em tempo real, 
              análises avançadas e visualizações interativas.
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📈</span>
                <span className={styles.featureText}>Analytics Avançadas</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🎯</span>
                <span className={styles.featureText}>KPIs em Tempo Real</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📊</span>
                <span className={styles.featureText}>Visualizações Interativas</span>
              </div>
            </div>
          </div>

          <div className={styles.formContainer}>
            <LoginForm
              onSubmit={handleLogin}
              loading={loading}
              error={error}
            />
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>R$ 2,8M+</strong>
              <span>Receita Monitorada</span>
            </div>
            <div className={styles.stat}>
              <strong>18K+</strong>
              <span>Pedidos Processados</span>
            </div>
            <div className={styles.stat}>
              <strong>45K+</strong>
              <span>Usuários Ativos</span>
            </div>
          </div>
          
          <p className={styles.footerText}>
            Dashboard Analytics v2.0 • Portfólio criado por{' '}
            <a href="#" className={styles.footerLink}>
              Reginaldo Assunção
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Login;