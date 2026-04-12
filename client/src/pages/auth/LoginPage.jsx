import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { Mail, Lock, LogIn, Loader2, AlertCircle, Shield } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const code = err.response?.data?.errorCode;
      const min = err.response?.data?.remainingMin;
      const errorMap = {
        INVALID_CREDENTIALS: t('login.invalidCredentials'),
        ACCOUNT_INACTIVE: t('login.accountInactive'),
        ACCOUNT_LOCKED: t('login.accountLocked').replace('{min}', min || '15'),
        LOGIN_REQUIRED_FIELDS: t('login.requiredFields')
      };
      setError(errorMap[code] || t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="login-branding">
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '10%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '560px' }}>
          <img
            src={logo}
            alt="Neuronita"
            style={{
              width: '100%',
              maxWidth: '480px',
              height: 'auto',
              display: 'block',
              margin: '0 auto var(--space-lg)',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))'
            }}
          />

          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-xl)' }}>
            {t('login.title')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', textAlign: 'left' }}>
            <FeatureItem text={t('login.feature1')} />
            <FeatureItem text={t('login.feature2')} />
            <FeatureItem text={t('login.feature3')} />
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-xs)' }}>
          <Shield size={14} />
          HIPAA Compliant System
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="login-form-panel">
        {/* Controls */}
        <div className="login-controls" style={{ position: 'absolute', top: 'var(--space-lg)', right: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="lang-toggle" onClick={toggleLanguage} title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}>
            {language === 'es' ? 'EN' : 'ES'}
          </button>
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? t('login.theme.dark') : t('login.theme.light')}>
            {theme === 'light' ? '☾' : '☀'}
          </button>
        </div>

        <div className="login-form-inner">
          {/* Mobile logo (visible only on mobile) */}
          <div className="login-mobile-header">
            <img src={logo} alt="Neuronita" style={{ width: '220px', height: 'auto', marginBottom: 'var(--space-sm)' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
              {t('login.title')}
            </p>
          </div>

          {/* Welcome */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-xs)' }}>
              {t('login.welcome')}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
              {t('login.subtitle')}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)',
              borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-lg)', border: '1px solid var(--color-error)'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label htmlFor="email">{t('login.email')}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('login.email.placeholder')} required autoComplete="email" style={{ paddingLeft: '40px', height: '44px' }} />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label htmlFor="password">{t('login.password')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('login.password.placeholder')} required autoComplete="current-password" style={{ paddingLeft: '40px', height: '44px' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: '46px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)',
                backgroundColor: loading ? 'var(--color-secondary)' : 'var(--color-primary)',
                color: 'var(--color-text-on-primary)', border: 'none', borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 2px 8px rgba(91, 44, 142, 0.3)'
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--color-primary)'; }}
            >
              {loading ? (
                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />{t('login.submitting')}</>
              ) : (
                <><LogIn size={18} />{t('login.submit')}</>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xs)', marginTop: 'var(--space-xl)', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
            <Shield size={12} />
            Neuronita EVF v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'rgba(255,255,255,0.85)', fontSize: 'var(--text-sm)' }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', flexShrink: 0 }} />
      {text}
    </div>
  );
}
