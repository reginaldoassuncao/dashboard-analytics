import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle, LogIn } from 'lucide-react';
import styles from './LoginForm.module.css';

function LoginForm({ onSubmit, loading = false, error = null }) {
  const [formData, setFormData] = useState({
    email: 'admin@dashboard.com', // Pre-fill for demo
    password: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value) => {
    const errors = {};
    
    if (name === 'email') {
      if (!value) {
        errors.email = 'Email é obrigatório';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.email = 'Email inválido';
      }
    }
    
    if (name === 'password') {
      if (!value) {
        errors.password = 'Senha é obrigatória';
      } else if (value.length < 3) {
        errors.password = 'Senha deve ter pelo menos 3 caracteres';
      }
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailErrors = validateField('email', formData.email);
    const passwordErrors = validateField('password', formData.password);
    const allErrors = { ...emailErrors, ...passwordErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      return;
    }

    // Clear any field errors and submit
    setFieldErrors({});
    onSubmit(formData);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@dashboard.com',
      password: 'admin'
    });
    setFieldErrors({});
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <LogIn size={24} />
        </div>
        <h2 className={styles.title}>Entrar no Dashboard</h2>
        <p className={styles.subtitle}>
          Acesse suas métricas e análises
        </p>
      </div>

      {error && (
        <div className={styles.error}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
              placeholder="seu@email.com"
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
          </div>
          {fieldErrors.email && (
            <span className={styles.fieldError}>{fieldErrors.email}</span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="password" className={styles.label}>
            Senha
          </label>
          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
              placeholder="Digite sua senha"
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.password && (
            <span className={styles.fieldError}>{fieldErrors.password}</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className={styles.spinner}></div>
              Entrando...
            </>
          ) : (
            <>
              <LogIn size={20} />
              Entrar
            </>
          )}
        </button>

        <div className={styles.demo}>
          <p className={styles.demoText}>
            🎯 <strong>Demo:</strong> Use admin@dashboard.com / admin
          </p>
          <button
            type="button"
            className={styles.demoButton}
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Preencher dados demo
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Dashboard Analytics v2.0 • Feito com ❤️ e React
        </p>
      </div>
    </form>
  );
}

export default LoginForm;